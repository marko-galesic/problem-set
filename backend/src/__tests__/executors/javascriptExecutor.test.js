import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { EventEmitter } from 'events';

const adapterStub = {
  generateSerializer: () => 'function serialize(val) { return JSON.stringify(val); }',
  generateInputHelpers: () => '',
  generateInvocation: () => 'actual = 42;',
  buildExpectedCode: (expected, indent, varName) => `${indent}const ${varName} = ${JSON.stringify(expected)};\n`,
  getSerializerMethod: () => 'serialize',
  getDefaultClassName: () => 'FallbackClass'
};

const sampleTestCases = [{ input: 'n=1', expected: 42 }];

function createFsMocks({ templateContent, helperContents = {}, readdirEntries = [] }) {
  const readFile = jest.fn(async (filePath) => {
    if (filePath.endsWith('template.js')) {
      return templateContent;
    }
    for (const [helperName, helperContent] of Object.entries(helperContents)) {
      if (filePath.endsWith(`${helperName}.js`)) {
        return helperContent;
      }
    }
    const err = new Error('ENOENT');
    err.code = 'ENOENT';
    throw err;
  });

  return {
    writeFile: jest.fn().mockResolvedValue(),
    appendFile: jest.fn().mockResolvedValue(),
    unlink: jest.fn().mockResolvedValue(),
    mkdir: jest.fn().mockResolvedValue(),
    readdir: jest.fn().mockResolvedValue(readdirEntries),
    stat: jest.fn().mockResolvedValue({
      isDirectory: () => false,
      isFile: () => false
    }),
    readFile
  };
}

function createSpawnMock({ stdout = '', stderr = '', exitCode = 0, signal = null, emitError = null, keepAlive = false }) {
  let lastProc = null;
  const spawnMock = jest.fn(() => {
    const proc = new EventEmitter();
    proc.stdout = new EventEmitter();
    proc.stderr = new EventEmitter();
    proc.killed = false;
    proc.kill = jest.fn((sig) => {
      proc.killed = true;
      proc.lastSignal = sig;
      return true;
    });
    lastProc = proc;

    if (stdout) {
      process.nextTick(() => proc.stdout.emit('data', Buffer.from(stdout)));
    }
    if (stderr) {
      process.nextTick(() => proc.stderr.emit('data', Buffer.from(stderr)));
    }
    if (emitError) {
      process.nextTick(() => proc.emit('error', emitError));
    } else if (!keepAlive) {
      process.nextTick(() => proc.emit('close', exitCode, signal));
    }

    return proc;
  });

  return { spawnMock, getLastProc: () => lastProc };
}

async function loadExecutor({ spawnMock, fsMocks }) {
  jest.unstable_mockModule('child_process', () => ({
    spawn: spawnMock,
    exec: jest.fn()
  }));
  jest.unstable_mockModule('fs/promises', () => fsMocks);
  const module = await import('../../executors/javascriptExecutor.js');
  return module.executeJavaScriptCode;
}

beforeEach(() => {
  jest.resetModules();
});

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});

describe('JavaScript Executor', () => {
  test('throws when adapter is missing', async () => {
    const templateContent = 'class MissingAdapter {}\n';
    const fsMocks = createFsMocks({ templateContent });
    const { spawnMock } = createSpawnMock({});
    const executeJavaScriptCode = await loadExecutor({ spawnMock, fsMocks });

    await expect(
      executeJavaScriptCode('class MissingAdapter {}', sampleTestCases, null, 'sample_challenge')
    ).rejects.toThrow('Adapter is required');
  });

  test('throws when class name cannot be resolved', async () => {
    const templateContent = '// no class definition here\n';
    const fsMocks = createFsMocks({ templateContent });
    const { spawnMock } = createSpawnMock({});
    const executeJavaScriptCode = await loadExecutor({ spawnMock, fsMocks });

    const adapter = {
      ...adapterStub,
      getDefaultClassName: () => ''
    };

    await expect(
      executeJavaScriptCode('function solve() { return 1; }', sampleTestCases, adapter, 'sample_challenge')
    ).rejects.toThrow('Could not determine class name');
  });

  test('extracts class name from template, includes helpers, and cleans up runner files', async () => {
    const templateContent = '// starter\nclass TemplateSolver {}\n';
    const helperContent = 'class TreeNode { constructor(val) { this.val = val; } }\n';
    const fsMocks = createFsMocks({
      templateContent,
      helperContents: { TreeNode: helperContent },
      readdirEntries: ['TemplateSolver_runner.js', 'notes.txt']
    });

    const output = [
      'TEST_0_ACTUAL:42',
      'TEST_0_EXPECTED:42',
      'TEST_0_RESULT:PASS',
      'TEST_0_TIME:5',
      'TEST_0_STDOUT:hello'
    ].join('\n');

    const { spawnMock } = createSpawnMock({ stderr: output });
    const executeJavaScriptCode = await loadExecutor({ spawnMock, fsMocks });

    const result = await executeJavaScriptCode(
      'class TemplateSolver { solve() { return 42; } }',
      sampleTestCases,
      adapterStub,
      'sample_challenge'
    );

    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toEqual(expect.objectContaining({
      actual: '42',
      expected: '42',
      passed: true,
      stdout: 'hello'
    }));

    expect(fsMocks.writeFile).toHaveBeenCalledTimes(1);
    const [writtenPath, writtenContent] = fsMocks.writeFile.mock.calls[0];
    expect(writtenPath).toContain('TemplateSolver_runner.js');
    expect(writtenContent).toContain(helperContent.trim());

    expect(fsMocks.readdir).toHaveBeenCalledTimes(1);
    const unlinkArgs = fsMocks.unlink.mock.calls.map(([path]) => path);
    expect(unlinkArgs.some((path) => path.includes('TemplateSolver_runner.js'))).toBe(true);
  });

  test('returns parsed failures when output is missing', async () => {
    const templateContent = 'class EmptyOutputSolver {}\n';
    const fsMocks = createFsMocks({ templateContent });
    const stderr = 'ERROR in test 0 (method invocation): TypeError: boom';
    const { spawnMock } = createSpawnMock({ stderr });
    const executeJavaScriptCode = await loadExecutor({ spawnMock, fsMocks });

    const result = await executeJavaScriptCode(
      'class EmptyOutputSolver { solve() { return 0; } }',
      sampleTestCases,
      adapterStub,
      'sample_challenge'
    );

    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(1);
    expect(result.results[0].passed).toBe(false);
    expect(result.results[0].error).toContain('TypeError');
  });

  test('returns runtime error on non-zero exit code', async () => {
    const templateContent = 'class FailingSolver {}\n';
    const fsMocks = createFsMocks({ templateContent });
    const { spawnMock } = createSpawnMock({ stderr: 'Boom', exitCode: 1 });
    const executeJavaScriptCode = await loadExecutor({ spawnMock, fsMocks });

    const result = await executeJavaScriptCode(
      'class FailingSolver { solve() { return 0; } }',
      sampleTestCases,
      adapterStub,
      'sample_challenge'
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain('Runtime error: Boom');
    expect(result.results).toEqual([]);
  });

  test('returns runtime error when spawn emits error', async () => {
    const templateContent = 'class SpawnErrorSolver {}\n';
    const fsMocks = createFsMocks({ templateContent });
    const { spawnMock } = createSpawnMock({ emitError: new Error('spawn broke') });
    const executeJavaScriptCode = await loadExecutor({ spawnMock, fsMocks });

    const result = await executeJavaScriptCode(
      'class SpawnErrorSolver { solve() { return 0; } }',
      sampleTestCases,
      adapterStub,
      'sample_challenge'
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain('Runtime error: spawn broke');
  });

  test('returns timeout error when execution exceeds limit', async () => {
    jest.useFakeTimers();
    const templateContent = 'class SlowSolver {}\n';
    const fsMocks = createFsMocks({ templateContent });
    const { spawnMock, getLastProc } = createSpawnMock({ keepAlive: true });
    const executeJavaScriptCode = await loadExecutor({ spawnMock, fsMocks });

    const execPromise = executeJavaScriptCode(
      'class SlowSolver { solve() { return 0; } }',
      sampleTestCases,
      adapterStub,
      'sample_challenge'
    );

    await jest.advanceTimersByTimeAsync(10000);
    const result = await execPromise;
    await jest.runOnlyPendingTimersAsync();

    expect(result.success).toBe(false);
    expect(result.error).toContain('Execution timeout');
    expect(getLastProc().kill).toHaveBeenCalledWith('SIGTERM');
  });
});
