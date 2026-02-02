import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { EventEmitter } from 'events';
import { join } from 'path';

const execMock = jest.fn();
const spawnMock = jest.fn();
const writeFileMock = jest.fn();
const unlinkMock = jest.fn();
const mkdirMock = jest.fn();
const appendFileMock = jest.fn();
const readdirMock = jest.fn();
const readFileMock = jest.fn();
const accessMock = jest.fn();
const statMock = jest.fn();

jest.unstable_mockModule('child_process', () => ({
  exec: execMock,
  spawn: spawnMock
}));

jest.unstable_mockModule('fs/promises', () => ({
  writeFile: writeFileMock,
  unlink: unlinkMock,
  mkdir: mkdirMock,
  appendFile: appendFileMock,
  readdir: readdirMock,
  readFile: readFileMock,
  access: accessMock,
  stat: statMock
}));

const { __testUtils } = await import('../../executors/javaExecutor.js');

const {
  spawnAsync,
  getTempDir,
  ensureTempDir,
  findJavaInstallation,
  detectWrapperClass,
  makeClassesStatic,
  removeInnerClassIfTopLevelExists,
  extractClassNameFromTemplate,
  parseTestResults,
  readResultsFile,
  deepEqual
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
  unlinkMock.mockReset();
  mkdirMock.mockReset();
  appendFileMock.mockReset();
  readdirMock.mockReset();
  readFileMock.mockReset();
  accessMock.mockReset();
  statMock.mockReset();

  mkdirMock.mockResolvedValue(undefined);
  writeFileMock.mockResolvedValue(undefined);
  appendFileMock.mockResolvedValue(undefined);
  readdirMock.mockResolvedValue([]);
  unlinkMock.mockResolvedValue(undefined);
  readFileMock.mockRejectedValue(new Error('missing'));
  accessMock.mockRejectedValue(new Error('missing'));
  statMock.mockResolvedValue({
    isDirectory: () => false,
    isFile: () => false
  });
  mockExecFailure();

  delete process.env.JAVA_HOME;
});

afterEach(() => {
  jest.useRealTimers();
});

describe('Java Executor utils', () => {
  test('getTempDir uses default challenge when omitted', () => {
    const dir = getTempDir();
    expect(dir).toContain(join('temp', 'two_sum', 'java'));
  });

  test('ensureTempDir swallows mkdir errors', async () => {
    mkdirMock.mockRejectedValue(new Error('mkdir failed'));
    await expect(ensureTempDir('bad_challenge')).resolves.toBeUndefined();
  });

  test('spawnAsync resolves on successful exit', async () => {
    const proc = createProc();
    spawnMock.mockReturnValue(proc);

    const promise = spawnAsync('java', ['-version'], {}, 0);
    process.nextTick(() => {
      proc.stdout.emit('data', 'ok');
      proc.emit('close', 0, null);
    });

    const result = await promise;
    expect(result.stdout).toContain('ok');
  });

  test('spawnAsync rejects on non-zero exit', async () => {
    const proc = createProc();
    spawnMock.mockReturnValue(proc);

    const promise = spawnAsync('java', [], {}, 0);
    process.nextTick(() => {
      proc.emit('close', 1, null);
    });

    await expect(promise).rejects.toThrow('Command failed');
  });

  test('spawnAsync rejects on error event', async () => {
    const proc = createProc();
    spawnMock.mockReturnValue(proc);

    const promise = spawnAsync('java', [], {}, 0);
    process.nextTick(() => {
      proc.emit('error', new Error('spawn error'));
    });

    await expect(promise).rejects.toThrow('spawn error');
  });

  test('spawnAsync rejects on timeout and attempts SIGKILL', async () => {
    jest.useFakeTimers();
    const proc = createProc({ trackKilled: false });
    spawnMock.mockReturnValue(proc);

    const promise = spawnAsync('java', [], {}, 10);
    const assertion = expect(promise).rejects.toThrow('Execution timeout');
    await Promise.resolve();
    await jest.advanceTimersByTimeAsync(10);

    await assertion;
    expect(proc.kill).toHaveBeenCalledWith('SIGTERM');

    await jest.advanceTimersByTimeAsync(1000);
    expect(proc.kill).toHaveBeenCalledWith('SIGKILL');
  });

  test('findJavaInstallation prefers JAVA_HOME', async () => {
    process.env.JAVA_HOME = '/custom/java';
    const result = await findJavaInstallation();
    expect(result).toBe('/custom/java');
  });

  test('findJavaInstallation resolves first homebrew path when accessible', async () => {
    accessMock.mockResolvedValue(undefined);
    const result = await findJavaInstallation();
    expect(result).toContain(join('openjdk@11', 'libexec', 'openjdk.jdk', 'Contents', 'Home'));
  });

  test('findJavaInstallation falls back to java_home utility', async () => {
    accessMock.mockRejectedValue(new Error('no access'));
    readdirMock.mockResolvedValue([]);
    mockExecSuccess('/Library/Java/Home\n');

    const result = await findJavaInstallation();
    expect(execMock).toHaveBeenCalled();
    expect([null, '/Library/Java/Home']).toContain(result);
  });

  test('findJavaInstallation returns null when no candidates found', async () => {
    accessMock.mockRejectedValue(new Error('no access'));
    readdirMock.mockResolvedValue([]);
    mockExecFailure();

    const result = await findJavaInstallation();
    expect(result).toBeNull();
  });

  test('detectWrapperClass returns false for non-string input', () => {
    const result = detectWrapperClass(null);
    expect(result.hasWrapper).toBe(false);
    expect(result.wrapperClassName).toBeNull();
  });

  test('detectWrapperClass identifies clean wrapper class', () => {
    const code = `
class Wrapper {
  public int[] solve(int[] nums) { return nums; }
}
`;
    const result = detectWrapperClass(code);
    expect(result.hasWrapper).toBe(true);
    expect(result.wrapperClassName).toBe('Wrapper');
  });

  test('detectWrapperClass ignores wrapper when extra code follows', () => {
    const code = `
class Wrapper {
}
class Extra {}
`;
    const result = detectWrapperClass(code);
    expect(result.hasWrapper).toBe(false);
  });

  test('detectWrapperClass allows small trailing code with members', () => {
    const code = `
class Wrapper {
  public int solve() { return 1; }
}
int extra = 1;
`;
    const result = detectWrapperClass(code);
    expect(result.hasWrapper).toBe(true);
    expect(result.wrapperClassName).toBe('Wrapper');
  });

  test('detectWrapperClass handles unmatched braces', () => {
    const code = `
class Wrapper {
  public int solve() { return 1; }
`;
    const result = detectWrapperClass(code);
    expect(result.hasWrapper).toBe(false);
  });

  test('makeClassesStatic adds static to class declarations', () => {
    const code = `
class Foo {
}
`;
    const result = makeClassesStatic(code);
    expect(result).toContain('static class Foo');
  });

  test('makeClassesStatic preserves existing static classes', () => {
    const code = `
static class Bar {
}
`;
    const result = makeClassesStatic(code);
    expect(result).toContain('static class Bar');
    expect(result).not.toContain('static static class');
  });

  test('makeClassesStatic returns non-string input as-is', () => {
    expect(makeClassesStatic(null)).toBeNull();
  });

  test('removeInnerClassIfTopLevelExists is no-op when top-level missing', () => {
    const code = 'class Outer {}';
    const result = removeInnerClassIfTopLevelExists(code, 'Node', false);
    expect(result).toBe(code);
  });

  test('removeInnerClassIfTopLevelExists removes inner class block', () => {
    const code = [
      'class Outer {',
      '  class Node {',
      '    int val;',
      '  }',
      '  int x;',
      '}'
    ].join('\n');
    const result = removeInnerClassIfTopLevelExists(code, 'Node', true);
    expect(result).not.toContain('class Node');
    expect(result).toContain('int x;');
  });

  test('removeInnerClassIfTopLevelExists preserves code when class not found', () => {
    const code = [
      'class Outer {',
      '  class Node {}',
      '}'
    ].join('\n');
    const result = removeInnerClassIfTopLevelExists(code, 'TreeNode', true);
    expect(result).toContain('class Node');
  });

  test('extractClassNameFromTemplate returns null when read fails', async () => {
    readFileMock.mockRejectedValue(new Error('missing'));
    const result = await extractClassNameFromTemplate('missing');
    expect(result).toBeNull();
  });

  test('extractClassNameFromTemplate extracts class name', async () => {
    readFileMock.mockResolvedValue('/* comment */\nclass TemplateName {\n}');
    const result = await extractClassNameFromTemplate('challenge');
    expect(result).toBe('TemplateName');
  });

  test('parseTestResults handles invalid output with stderr errors', async () => {
    const testCases = [{ id: 1 }, { id: 2 }];
    const stderr = 'ERROR in test 1 (method invocation): boom\nstack';
    const results = await parseTestResults(null, testCases, stderr);
    expect(results[0].error).toContain('ERROR in test 1');
    expect(results[1].error).toBeNull();
  });

  test('parseTestResults parses mixed output formats', async () => {
    const testCases = [{ id: 1 }, { id: 2 }];
    const output = [
      'TEST_0_ACTUAL:',
      'TEST_0_EXPECTED:',
      'TEST_0_RESULT:',
      'TEST_0_TIME:',
      'TEST_0_STDOUT:first line',
      'second line',
      'TEST_1_ACTUAL:1',
      'TEST_1_EXPECTED:1',
      'TEST_1_RESULT:PASS',
      'TEST_1_TIME:7',
      'TEST_1_STDOUT:'
    ].join('\n');

    const results = await parseTestResults(output, testCases, '');
    expect(results[0].actual).toBe('');
    expect(results[0].stdout).toContain('first line');
    expect(results[0].stdout).toContain('second line');
    expect(results[1].passed).toBe(true);
    expect(results[1].executionTime).toBe(7);
  });

  test('readResultsFile maps json payload to results', async () => {
    const testCases = [{ id: 1, input: 'n=1', expected: 1 }];
    const payload = {
      results: [
        {
          actual: '1',
          expected: '1',
          passed: true,
          durationMs: 4,
          stdout: 'from file',
          error: null
        }
      ]
    };

    readFileMock.mockResolvedValue(JSON.stringify(payload));
    const results = await readResultsFile('/tmp/results.json', testCases, '');

    expect(results).toHaveLength(1);
    expect(results[0]).toEqual(expect.objectContaining({
      actual: '1',
      expected: '1',
      passed: true,
      executionTime: 4,
      stdout: 'from file'
    }));
  });

  test('readResultsFile maps array payload and keeps error text', async () => {
    const testCases = [{ id: 1, input: 'n=1', expected: 1 }];
    const payload = [
      {
        actual: '1',
        expected: '1',
        passed: true,
        durationMs: '5',
        stdout: 'ok',
        error: 'boom'
      }
    ];

    readFileMock.mockResolvedValue(JSON.stringify(payload));
    const results = await readResultsFile('/tmp/results.json', testCases, '');

    expect(results).toHaveLength(1);
    expect(results[0].executionTime).toBe(5);
    expect(results[0].error).toBe('boom');
  });

  test('readResultsFile returns null on invalid json', async () => {
    readFileMock.mockResolvedValue('not-json');
    const results = await readResultsFile('/tmp/results.json', [{ id: 1 }], '');
    expect(results).toBeNull();
  });

  test('readResultsFile returns null on empty content', async () => {
    readFileMock.mockResolvedValue('');
    const results = await readResultsFile('/tmp/results.json', [{ id: 1 }], '');
    expect(results).toBeNull();
  });

  test('deepEqual compares nested objects and arrays', () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual(null, {})).toBe(false);
    expect(deepEqual({ a: [1, 2] }, { a: [1, 2] })).toBe(true);
    expect(deepEqual({ a: [1, 2] }, { a: [1, 3] })).toBe(false);
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
  });
});
