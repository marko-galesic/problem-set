import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { EventEmitter } from 'events';

const execMock = jest.fn();
const spawnMock = jest.fn();
const writeFileMock = jest.fn();
const appendFileMock = jest.fn();
const unlinkMock = jest.fn();
const mkdirMock = jest.fn();
const readdirMock = jest.fn();
const readFileMock = jest.fn();
const statMock = jest.fn();

jest.unstable_mockModule('child_process', () => ({
  exec: execMock,
  spawn: spawnMock
}));

jest.unstable_mockModule('fs/promises', () => ({
  writeFile: writeFileMock,
  appendFile: appendFileMock,
  unlink: unlinkMock,
  mkdir: mkdirMock,
  readdir: readdirMock,
  readFile: readFileMock,
  stat: statMock
}));

const { executePythonCode } = await import('../../executors/pythonExecutor.js');

const baseAdapter = {
  generateSerializer: () => [
    'def serialize(value):',
    '    if value is None:',
    '        return "null"',
    '    return str(value)',
    ''
  ].join('\n'),
  generateInputHelpers: () => '',
  generateInvocation: () => 'actual = parser.solve(i)\n',
  buildExpectedCode: (expected, indent = '    ', variable = 'expected') => {
    const serialized = JSON.stringify(expected);
    return `${indent}${variable} = ${serialized}\n`;
  },
  getSerializerMethod: () => 'serialize',
  getDefaultClassName: () => 'Fallback'
};

const createAdapter = (overrides = {}) => ({
  ...baseAdapter,
  ...overrides
});

const testCases = [
  { id: 1, input: '1', expected: 1 },
  { id: 2, input: '2', expected: 3 }
];

let lastSpawnedProcess = null;

function createMockProcess() {
  const proc = new EventEmitter();
  proc.stdout = new EventEmitter();
  proc.stderr = new EventEmitter();
  proc.killed = false;
  proc.kill = jest.fn((signal) => {
    proc.killed = true;
    proc.killSignal = signal;
  });
  return proc;
}

function mockExecSuccess() {
  execMock.mockImplementation((command, options, callback) => {
    const cb = typeof options === 'function' ? options : callback;
    cb(null, 'Python 3.11.0', '');
  });
}

function mockExecFailure() {
  execMock.mockImplementation((command, options, callback) => {
    const cb = typeof options === 'function' ? options : callback;
    cb(new Error('not found'));
  });
}

function mockSpawnWithOutput({ stdout = '', stderr = '', exitCode = 0, error = null } = {}) {
  spawnMock.mockImplementation(() => {
    const proc = createMockProcess();
    lastSpawnedProcess = proc;
    process.nextTick(() => {
      if (stdout) {
        proc.stdout.emit('data', stdout);
      }
      if (stderr) {
        proc.stderr.emit('data', stderr);
      }
      if (error) {
        proc.emit('error', error);
        return;
      }
      proc.emit('close', exitCode, null);
    });
    return proc;
  });
}

beforeEach(() => {
  execMock.mockReset();
  spawnMock.mockReset();
  writeFileMock.mockReset();
  appendFileMock.mockReset();
  unlinkMock.mockReset();
  mkdirMock.mockReset();
  readdirMock.mockReset();
  readFileMock.mockReset();
  statMock.mockReset();
  lastSpawnedProcess = null;

  mkdirMock.mockResolvedValue(undefined);
  writeFileMock.mockResolvedValue(undefined);
  appendFileMock.mockResolvedValue(undefined);
  readdirMock.mockResolvedValue([]);
  unlinkMock.mockResolvedValue(undefined);
  readFileMock.mockRejectedValue(new Error('not found'));
  statMock.mockResolvedValue({
    isDirectory: () => false,
    isFile: () => false
  });

  delete process.env.PYTHON_EXECUTABLE;
  mockExecSuccess();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('Python Executor', () => {
  test('throws when adapter is missing', async () => {
    await expect(
      executePythonCode('print("no adapter")', [], null, 'missing_adapter')
    ).rejects.toThrow('Adapter is required');
  });

  test('uses class name from template when available', async () => {
    const templateContent = [
      '"""',
      'class IgnoreMe:',
      '    pass',
      '"""',
      '# comment',
      'class TemplateSolver:',
      '    def solve(self, i):',
      '        return i'
    ].join('\n');

    readFileMock.mockImplementation((filePath) => {
      if (filePath.includes('/data/template_challenge/template.py')) {
        return Promise.resolve(templateContent);
      }
      return Promise.reject(new Error('not found'));
    });

    mockSpawnWithOutput({ stdout: '', stderr: '', exitCode: 0 });

    const adapter = createAdapter({ getDefaultClassName: () => 'Fallback' });
    const result = await executePythonCode('class TemplateSolver:\n    pass', [], adapter, 'template_challenge');

    expect(result.success).toBe(true);
    const [filePath, pythonSource] = writeFileMock.mock.calls[0];
    expect(filePath).toContain('TemplateSolver_runner.py');
    expect(pythonSource).toContain('parser = TemplateSolver()');
    expect(readFileMock.mock.calls.some(call => call[0].includes('/data/template_challenge/template.py'))).toBe(true);
  });

  test('returns error when python runtime is not found', async () => {
    mockExecFailure();

    const result = await executePythonCode('class Fallback:\n    pass', [], createAdapter(), 'missing_python');

    expect(result.success).toBe(false);
    expect(result.error).toContain('Python runtime not found');
    expect(result.results).toEqual([]);
    expect(spawnMock).not.toHaveBeenCalled();
  });

  test('returns runtime error when python exits non-zero', async () => {
    mockSpawnWithOutput({ stderr: 'Traceback: boom', exitCode: 1 });

    const result = await executePythonCode('class Fallback:\n    pass', [], createAdapter(), 'runtime_error');

    expect(result.success).toBe(false);
    expect(result.error).toContain('Runtime error: Traceback');
  });

  test('returns runtime error when spawn emits error event', async () => {
    mockSpawnWithOutput({ error: new Error('spawn failed') });

    const result = await executePythonCode('class Fallback:\n    pass', [], createAdapter(), 'spawn_error');

    expect(result.success).toBe(false);
    expect(result.error).toContain('Runtime error: spawn failed');
  });

  test('returns timeout when execution exceeds limit', async () => {
    jest.useFakeTimers();
    spawnMock.mockImplementation(() => {
      const proc = createMockProcess();
      lastSpawnedProcess = proc;
      return proc;
    });

    const execPromise = executePythonCode('class Fallback:\n    pass', [], createAdapter(), 'timeout_challenge');
    await Promise.resolve();
    await jest.advanceTimersByTimeAsync(10000);

    const result = await execPromise;

    expect(result.success).toBe(false);
    expect(result.error).toContain('Execution timeout');
    expect(lastSpawnedProcess.kill).toHaveBeenCalledWith('SIGTERM');
  });

  test('parses multi-test output, stderr sections, and cleans up runner files', async () => {
    const output = [
      'TEST_0_ACTUAL:1',
      'TEST_0_EXPECTED:1',
      'TEST_0_RESULT:PASS',
      'TEST_0_TIME:5',
      'TEST_0_STDOUT:line one',
      'line two',
      'TEST_1_ACTUAL:2',
      'TEST_1_EXPECTED:3',
      'TEST_1_RESULT:FAIL',
      'TEST_1_TIME:7',
      'TEST_1_STDOUT:'
    ].join('\n');

    const stderr = [
      'ERROR in test 0 (method invocation): ValueError: bad input',
      'stack line',
      'ERROR in test 1 (method invocation): TypeError: fail',
      'more info'
    ].join('\n');

    mockSpawnWithOutput({ stdout: output, stderr, exitCode: 0 });
    readdirMock.mockResolvedValue(['Fallback_runner.py', 'notes.txt']);

    const result = await executePythonCode('class Fallback:\n    pass', testCases, createAdapter(), 'parse_challenge');

    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(2);
    expect(result.results[0].actual).toBe('1');
    expect(result.results[0].expected).toBe('1');
    expect(result.results[0].passed).toBe(true);
    expect(result.results[0].executionTime).toBe(5);
    expect(result.results[0].stdout).toBe('line one\nline two');
    expect(result.results[0].error).toContain('ValueError');
    expect(result.results[0].error).toContain('stack line');
    expect(result.results[0].error).not.toContain('TypeError');

    expect(result.results[1].actual).toBe('2');
    expect(result.results[1].expected).toBe('3');
    expect(result.results[1].passed).toBe(false);
    expect(result.results[1].executionTime).toBe(7);
    expect(result.results[1].stdout).toBe('');
    expect(result.results[1].error).toContain('TypeError');

    expect(readdirMock).toHaveBeenCalledWith(expect.stringContaining('/temp/parse_challenge/python'));
    expect(unlinkMock).toHaveBeenCalledWith(expect.stringContaining('Fallback_runner.py'));
  });
});
