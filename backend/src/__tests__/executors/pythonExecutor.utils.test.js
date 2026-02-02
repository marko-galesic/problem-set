import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { EventEmitter } from 'events';
import { join } from 'path';

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

const { __testUtils } = await import('../../executors/pythonExecutor.js');

const {
  getTempDir,
  ensureTempDir,
  spawnAsync,
  findPythonExecutable,
  indentCode,
  stripTripleQuotedStrings,
  extractClassNameFromTemplate,
  hasClassDefinition,
  readResultsFile
} = __testUtils;

function createProc({ trackKilled = true } = {}) {
  const proc = new EventEmitter();
  proc.stdout = new EventEmitter();
  proc.stderr = new EventEmitter();
  proc.killed = false;
  proc.kill = jest.fn((signal) => {
    proc.lastSignal = signal;
    if (trackKilled) {
      proc.killed = true;
    }
  });
  return proc;
}

function mockExecSuccess(stdout = '') {
  execMock.mockImplementation((command, options, callback) => {
    const cb = typeof options === 'function' ? options : callback;
    cb(null, stdout, '');
  });
}

function mockExecFailure(message = 'exec failed') {
  execMock.mockImplementation((command, options, callback) => {
    const cb = typeof options === 'function' ? options : callback;
    cb(new Error(message));
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

  mkdirMock.mockResolvedValue(undefined);
  writeFileMock.mockResolvedValue(undefined);
  appendFileMock.mockResolvedValue(undefined);
  readdirMock.mockResolvedValue([]);
  unlinkMock.mockResolvedValue(undefined);
  readFileMock.mockRejectedValue(new Error('missing'));
  statMock.mockResolvedValue({
    isDirectory: () => false,
    isFile: () => false
  });

  delete process.env.PYTHON_EXECUTABLE;
  mockExecFailure();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('Python Executor utils', () => {
  test('getTempDir uses default challenge when omitted', () => {
    const dir = getTempDir();
    expect(dir).toContain(join('temp', 'two_sum', 'python'));
  });

  test('ensureTempDir swallows mkdir errors', async () => {
    mkdirMock.mockRejectedValue(new Error('mkdir failed'));
    await expect(ensureTempDir('oops')).resolves.toBeUndefined();
  });

  test('stripTripleQuotedStrings returns empty string for falsy input', () => {
    expect(stripTripleQuotedStrings('')).toBe('');
  });

  test('stripTripleQuotedStrings removes triple-quoted blocks', () => {
    const code = '"""class Hidden: pass"""\nclass Visible: pass';
    expect(stripTripleQuotedStrings(code)).toContain('class Visible');
    expect(stripTripleQuotedStrings(code)).not.toContain('Hidden');
  });

  test('indentCode indents non-empty lines only', () => {
    const code = 'line1\n\nline2';
    const result = indentCode(code, 2);
    expect(result).toContain('  line1');
    expect(result).toContain('\n\n');
    expect(result).toContain('  line2');
  });

  test('hasClassDefinition detects class names', () => {
    expect(hasClassDefinition('', 'Foo')).toBe(false);
    expect(hasClassDefinition('class Foo:\n  pass', 'Foo')).toBe(true);
  });

  test('extractClassNameFromTemplate returns null on read error', async () => {
    readFileMock.mockRejectedValue(new Error('missing'));
    const result = await extractClassNameFromTemplate('missing');
    expect(result).toBeNull();
  });

  test('extractClassNameFromTemplate extracts class name', async () => {
    readFileMock.mockResolvedValue('"""doc"""\nclass TemplateSolver:\n  pass');
    const result = await extractClassNameFromTemplate('challenge');
    expect(result).toBe('TemplateSolver');
  });

  test('findPythonExecutable uses PYTHON_EXECUTABLE when set', async () => {
    process.env.PYTHON_EXECUTABLE = '/usr/bin/python-custom';
    mockExecSuccess('Python 3.11.0');
    const result = await findPythonExecutable();
    expect(result).toBe('/usr/bin/python-custom');
  });

  test('findPythonExecutable falls back to python candidate', async () => {
    execMock.mockImplementation((command, options, callback) => {
      const cb = typeof options === 'function' ? options : callback;
      if (command.startsWith('python3')) {
        cb(new Error('python3 missing'));
      } else {
        cb(null, 'Python 3.10.0', '');
      }
    });
    const result = await findPythonExecutable();
    expect(result).toBe('python');
  });

  test('findPythonExecutable returns null when all candidates fail', async () => {
    mockExecFailure();
    const result = await findPythonExecutable();
    expect(result).toBeNull();
  });

  test('spawnAsync rejects on timeout and attempts SIGKILL', async () => {
    jest.useFakeTimers();
    const proc = createProc({ trackKilled: false });
    spawnMock.mockReturnValue(proc);
    const promise = spawnAsync('python', [], {}, 5);
    const assertion = expect(promise).rejects.toThrow('Execution timeout');

    await Promise.resolve();
    await jest.advanceTimersByTimeAsync(5);
    await assertion;
    expect(proc.kill).toHaveBeenCalledWith('SIGTERM');

    await jest.advanceTimersByTimeAsync(1000);
    expect(proc.kill).toHaveBeenCalledWith('SIGKILL');
  });

  test('readResultsFile maps array payload and uses stderr errors', async () => {
    const payload = [
      {
        actual: '1',
        expected: '1',
        passed: true,
        durationMs: 6,
        stdout: 'ok',
        error: null
      },
      {
        actualStr: '2',
        expectedStr: '3',
        passed: false,
        durationMs: '9',
        stdoutValue: '',
        error: null
      }
    ];
    readFileMock.mockResolvedValue(JSON.stringify(payload));
    const stderr = 'ERROR in test 1 (method invocation): Boom';
    const results = await readResultsFile('/tmp/results.json', [{ id: 1 }, { id: 2 }], stderr);
    expect(results).toHaveLength(2);
    expect(results[0].passed).toBe(true);
    expect(results[1].executionTime).toBe(9);
    expect(results[1].error).toContain('ERROR in test 1');
  });

  test('readResultsFile returns null on invalid json', async () => {
    readFileMock.mockResolvedValue('not-json');
    const results = await readResultsFile('/tmp/results.json', [], '');
    expect(results).toBeNull();
  });

  test('readResultsFile returns null on empty content', async () => {
    readFileMock.mockResolvedValue('');
    const results = await readResultsFile('/tmp/results.json', [], '');
    expect(results).toBeNull();
  });

  test('readResultsFile returns null when results are not an array', async () => {
    readFileMock.mockResolvedValue(JSON.stringify({ results: 'nope' }));
    const results = await readResultsFile('/tmp/results.json', [], '');
    expect(results).toBeNull();
  });
});
