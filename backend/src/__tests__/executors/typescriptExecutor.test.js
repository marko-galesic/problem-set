import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { EventEmitter } from 'events';

const adapterStub = {
  generateSerializer: () => 'function serialize(val) { return JSON.stringify(val); }',
  generateInputHelpers: () => '',
  generateInvocation: () => 'actual = 7;',
  buildExpectedCode: (expected, indent, varName) => `${indent}const ${varName} = ${JSON.stringify(expected)};\n`,
  getSerializerMethod: () => 'serialize',
  getDefaultClassName: () => 'FallbackClass'
};

const sampleTestCases = [{ input: 'n=1', expected: 7 }];

function createFsMocks({ templateContent, helperContents = {}, readdirEntries = [] }) {
  const readFile = jest.fn(async (filePath) => {
    if (filePath.endsWith('template.ts')) {
      return templateContent;
    }
    for (const [helperName, helperContent] of Object.entries(helperContents)) {
      if (filePath.endsWith(`${helperName}.ts`)) {
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
    stat: jest.fn().mockResolvedValue({ isDirectory: () => false }),
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

async function loadExecutor({
  spawnMock,
  fsMocks,
  forceTsNodeMissing = false,
  forceTsNodeAvailable = false
}) {
  jest.unstable_mockModule('child_process', () => ({
    spawn: spawnMock,
    exec: jest.fn()
  }));
  jest.unstable_mockModule('fs/promises', () => fsMocks);
  if (forceTsNodeMissing) {
    jest.unstable_mockModule('module', () => ({
      createRequire: () => ({
        resolve: () => {
          throw new Error('ts-node not found');
        }
      })
    }));
  } else if (forceTsNodeAvailable) {
    jest.unstable_mockModule('module', () => ({
      createRequire: () => ({
        resolve: () => '/tmp/ts-node'
      })
    }));
  }
  const module = await import('../../executors/typescriptExecutor.js');
  return module.executeTypeScriptCode;
}

beforeEach(() => {
  jest.resetModules();
});

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});

describe('TypeScript Executor', () => {
  test('falls back to JS runner when ts-node is unavailable', async () => {
    const templateContent = 'class TsSolver {}\n';
    const fsMocks = createFsMocks({
      templateContent,
      readdirEntries: ['TsSolver_runner.js']
    });

    const output = [
      'TEST_0_ACTUAL:7',
      'TEST_0_EXPECTED:7',
      'TEST_0_RESULT:PASS',
      'TEST_0_TIME:3',
      'TEST_0_STDOUT:ok'
    ].join('\n');

    const { spawnMock } = createSpawnMock({ stdout: output });
    const executeTypeScriptCode = await loadExecutor({
      spawnMock,
      fsMocks,
      forceTsNodeMissing: true
    });

    const result = await executeTypeScriptCode(
      'class TsSolver { solve() { return 7; } }',
      sampleTestCases,
      adapterStub,
      'sample_challenge'
    );

    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(1);

    expect(fsMocks.writeFile).toHaveBeenCalledTimes(1);
    const [writtenPath] = fsMocks.writeFile.mock.calls[0];
    expect(writtenPath).toContain('TsSolver_runner.js');

    expect(spawnMock).toHaveBeenCalledTimes(1);
    const [, spawnArgs, spawnOptions] = spawnMock.mock.calls[0];
    expect(spawnArgs).toHaveLength(1);
    expect(spawnArgs[0]).toContain('TsSolver_runner.js');
    expect(spawnOptions.env).toBe(process.env);
  });

  test('uses ts-node loader when available', async () => {
    const templateContent = 'class TsNodeSolver {}\n';
    const fsMocks = createFsMocks({
      templateContent,
      readdirEntries: ['TsNodeSolver_runner.ts']
    });

    const output = [
      'TEST_0_ACTUAL:7',
      'TEST_0_EXPECTED:7',
      'TEST_0_RESULT:PASS',
      'TEST_0_TIME:3',
      'TEST_0_STDOUT:ok'
    ].join('\n');

    const { spawnMock } = createSpawnMock({ stdout: output, stderr: 'warn' });
    const executeTypeScriptCode = await loadExecutor({
      spawnMock,
      fsMocks,
      forceTsNodeAvailable: true
    });

    const result = await executeTypeScriptCode(
      'class TsNodeSolver { solve() { return 7; } }',
      sampleTestCases,
      adapterStub,
      'sample_challenge'
    );

    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(1);

    expect(fsMocks.writeFile).toHaveBeenCalledTimes(1);
    const [writtenPath] = fsMocks.writeFile.mock.calls[0];
    expect(writtenPath).toContain('TsNodeSolver_runner.ts');

    const [, spawnArgs, spawnOptions] = spawnMock.mock.calls[0];
    expect(spawnArgs).toContain('--loader');
    expect(spawnArgs).toContain('ts-node/esm');
    expect(spawnOptions.env.TS_NODE_TRANSPILE_ONLY).toBe('1');
  });

  test('returns runtime error on non-zero exit code', async () => {
    const templateContent = 'class TsFailSolver {}\n';
    const fsMocks = createFsMocks({ templateContent });
    const { spawnMock } = createSpawnMock({ stderr: 'Boom', exitCode: 1 });
    const executeTypeScriptCode = await loadExecutor({
      spawnMock,
      fsMocks,
      forceTsNodeAvailable: true
    });

    const result = await executeTypeScriptCode(
      'class TsFailSolver { solve() { return 0; } }',
      sampleTestCases,
      adapterStub,
      'sample_challenge'
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain('Runtime error: Boom');
  });

  test('returns runtime error when spawn emits error', async () => {
    const templateContent = 'class TsSpawnError {}\n';
    const fsMocks = createFsMocks({ templateContent });
    const { spawnMock } = createSpawnMock({ emitError: new Error('spawn failed') });
    const executeTypeScriptCode = await loadExecutor({
      spawnMock,
      fsMocks,
      forceTsNodeAvailable: true
    });

    const result = await executeTypeScriptCode(
      'class TsSpawnError { solve() { return 0; } }',
      sampleTestCases,
      adapterStub,
      'sample_challenge'
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain('Runtime error: spawn failed');
  });

  test('returns timeout error when execution exceeds limit', async () => {
    jest.useFakeTimers();
    const templateContent = 'class TsSlowSolver {}\n';
    const fsMocks = createFsMocks({ templateContent });
    const { spawnMock, getLastProc } = createSpawnMock({ keepAlive: true });
    const executeTypeScriptCode = await loadExecutor({
      spawnMock,
      fsMocks,
      forceTsNodeAvailable: true
    });

    const execPromise = executeTypeScriptCode(
      'class TsSlowSolver { solve() { return 0; } }',
      sampleTestCases,
      adapterStub,
      'sample_challenge'
    );

    await jest.advanceTimersByTimeAsync(10000);
    const result = await execPromise;

    expect(result.success).toBe(false);
    expect(result.error).toContain('Execution timeout');
    expect(getLastProc().kill).toHaveBeenCalledWith('SIGTERM');
  });
});
