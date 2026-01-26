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
  stat: statMock
}));

const { __testUtils } = await import('../../executors/javascriptExecutor.js');

const {
  getTempDir,
  ensureTempDir,
  spawnAsync,
  stripBlockComments,
  extractClassNameFromTemplate,
  hasClassDefinition
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

beforeEach(() => {
  spawnMock.mockReset();
  execMock.mockReset();
  writeFileMock.mockReset();
  unlinkMock.mockReset();
  mkdirMock.mockReset();
  appendFileMock.mockReset();
  readdirMock.mockReset();
  readFileMock.mockReset();
  statMock.mockReset();

  mkdirMock.mockResolvedValue(undefined);
  writeFileMock.mockResolvedValue(undefined);
  unlinkMock.mockResolvedValue(undefined);
  readdirMock.mockResolvedValue([]);
  readFileMock.mockRejectedValue(new Error('missing'));
  statMock.mockResolvedValue({
    isDirectory: () => false,
    isFile: () => false
  });
});

afterEach(() => {
  jest.useRealTimers();
});

describe('JavaScript Executor utils', () => {
  test('getTempDir uses default challenge when omitted', () => {
    const dir = getTempDir();
    expect(dir).toContain(join('temp', 'two_sum', 'javascript'));
  });

  test('ensureTempDir swallows mkdir errors', async () => {
    mkdirMock.mockRejectedValue(new Error('mkdir failed'));
    await expect(ensureTempDir('oops')).resolves.toBeUndefined();
  });

  test('stripBlockComments returns empty string for falsy input', () => {
    expect(stripBlockComments('')).toBe('');
  });

  test('stripBlockComments removes block comments', () => {
    const code = 'const x = 1; /* comment */ const y = 2;';
    expect(stripBlockComments(code)).toContain('const x = 1;');
    expect(stripBlockComments(code)).not.toContain('comment');
  });

  test('hasClassDefinition detects class names', () => {
    expect(hasClassDefinition('', 'Foo')).toBe(false);
    expect(hasClassDefinition('class Foo {}', 'Foo')).toBe(true);
  });

  test('extractClassNameFromTemplate returns null on read error', async () => {
    readFileMock.mockRejectedValue(new Error('missing'));
    const result = await extractClassNameFromTemplate('missing');
    expect(result).toBeNull();
  });

  test('extractClassNameFromTemplate extracts class name', async () => {
    readFileMock.mockResolvedValue('// comment\nclass TemplateSolver {}');
    const result = await extractClassNameFromTemplate('challenge');
    expect(result).toBe('TemplateSolver');
  });

  test('spawnAsync resolves on exit code 0', async () => {
    const proc = createProc();
    spawnMock.mockReturnValue(proc);
    const promise = spawnAsync('node', ['-v'], {}, 0);
    process.nextTick(() => {
      proc.stdout.emit('data', 'ok');
      proc.emit('close', 0, null);
    });
    const result = await promise;
    expect(result.stdout).toContain('ok');
  });

  test('spawnAsync rejects on timeout and attempts SIGKILL', async () => {
    jest.useFakeTimers();
    const proc = createProc({ trackKilled: false });
    spawnMock.mockReturnValue(proc);
    const promise = spawnAsync('node', [], {}, 5);
    const assertion = expect(promise).rejects.toThrow('Execution timeout');

    await Promise.resolve();
    await jest.advanceTimersByTimeAsync(5);
    await assertion;
    expect(proc.kill).toHaveBeenCalledWith('SIGTERM');

    await jest.advanceTimersByTimeAsync(1000);
    expect(proc.kill).toHaveBeenCalledWith('SIGKILL');
  });
});
