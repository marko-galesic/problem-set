import { spawn } from 'child_process';
import { mkdir, readdir, unlink, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_CHALLENGE } from '../server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TIMEOUT_MS = 10000;

function getTempDir(challengeId = DEFAULT_CHALLENGE) {
  return join(__dirname, '../../temp', challengeId, 'cpp');
}

async function ensureTempDir(challengeId = DEFAULT_CHALLENGE) {
  await mkdir(getTempDir(challengeId), { recursive: true });
}

function spawnAsync(command, args, options, timeoutMs) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options);
    let stdout = '';
    let stderr = '';
    let timeoutId = null;

    child.stdout.on('data', (data) => { stdout += data.toString(); });
    child.stderr.on('data', (data) => { stderr += data.toString(); });

    if (timeoutMs) {
      timeoutId = setTimeout(() => {
        child.kill('SIGTERM');
        const error = new Error('Execution timeout');
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
      }, timeoutMs);
    }

    child.on('error', (error) => {
      if (timeoutId) clearTimeout(timeoutId);
      reject(error);
    });
    child.on('close', (code) => {
      if (timeoutId) clearTimeout(timeoutId);
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }
      const error = new Error(`Command failed with code ${code}`);
      error.stdout = stdout;
      error.stderr = stderr;
      reject(error);
    });
  });
}

function parseResults(output, testCases) {
  const fields = new Map();
  for (const line of String(output || '').split(/\r?\n/)) {
    const match = line.match(/^TEST_(\d+)_(ACTUAL|EXPECTED|RESULT|TIME|ERROR):(.*)$/);
    if (!match) continue;
    const index = Number.parseInt(match[1], 10);
    if (!fields.has(index)) fields.set(index, {});
    fields.get(index)[match[2].toLowerCase()] = match[3];
  }
  return testCases.map((testCase, index) => {
    const entry = fields.get(index) || {};
    return {
      testCase,
      actual: entry.actual ?? null,
      expected: entry.expected ?? null,
      passed: entry.result === 'PASS',
      executionTime: Number.parseInt(entry.time, 10) || 0,
      stdout: '',
      error: entry.error || null
    };
  });
}

async function cleanup(tempDir) {
  const files = await readdir(tempDir).catch(() => []);
  await Promise.all(files
    .filter((file) => file.startsWith('runner_'))
    .map((file) => unlink(join(tempDir, file)).catch(() => {})));
}

export async function executeCppCode(userCode, testCases, adapter, challengeId = DEFAULT_CHALLENGE) {
  if (!adapter) {
    throw new Error('Adapter is required for executeCppCode');
  }
  if (adapter.getReturnType() !== 'int') {
    throw new Error('C++ execution currently supports integer-returning challenges only.');
  }

  await ensureTempDir(challengeId);
  const tempDir = getTempDir(challengeId);
  const className = adapter.getDefaultClassName?.();
  if (!className) {
    throw new Error(`Could not determine C++ class name for challenge ${challengeId}.`);
  }

  const invocation = adapter.generateInvocation('solution');
  const inputHelpers = adapter.generateInputHelpers(testCases);
  const serializer = adapter.generateSerializer();
  const expectedValues = testCases.map((testCase) => (
    Number.isFinite(testCase.expected) ? testCase.expected : 0
  )).join(', ');
  const suffix = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const sourcePath = join(tempDir, `runner_${suffix}.cpp`);
  const binaryPath = join(tempDir, `runner_${suffix}`);

  const source = `#include <algorithm>
#include <chrono>
#include <exception>
#include <iostream>
#include <string>
#include <vector>

${userCode || ''}

${serializer}

${inputHelpers}

int main() {
  ${className} solution;
  static const std::vector<int> expectedValues = { ${expectedValues} };
  for (int i = 0; i < ${testCases.length}; ++i) {
    int actual = 0;
    const int expected = expectedValues.at(i);
    bool passed = false;
    std::string error;
    const auto started = std::chrono::steady_clock::now();
    try {
      ${invocation.replace(/\n/g, '\n      ')}
      passed = serializeInt(actual) == serializeInt(expected);
    } catch (const std::exception& exception) {
      error = exception.what();
    } catch (...) {
      error = "Unknown exception";
    }
    const auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(
      std::chrono::steady_clock::now() - started
    ).count();
    std::cerr << "TEST_" << i << "_ACTUAL:" << serializeInt(actual) << '\\n';
    std::cerr << "TEST_" << i << "_EXPECTED:" << serializeInt(expected) << '\\n';
    std::cerr << "TEST_" << i << "_RESULT:" << (passed ? "PASS" : "FAIL") << '\\n';
    std::cerr << "TEST_" << i << "_TIME:" << duration << '\\n';
    std::cerr << "TEST_" << i << "_ERROR:" << error << '\\n';
  }
  return 0;
}
`;

  try {
    await writeFile(sourcePath, source, 'utf8');
    try {
      await spawnAsync('g++', ['-std=c++17', '-O2', '-pipe', sourcePath, '-o', binaryPath], { cwd: tempDir }, TIMEOUT_MS);
    } catch (error) {
      return {
        success: false,
        error: `Compilation error: ${error.stderr || error.message}`,
        results: []
      };
    }

    const started = Date.now();
    try {
      const execution = await spawnAsync(binaryPath, [], { cwd: tempDir }, TIMEOUT_MS);
      return {
        success: true,
        results: parseResults(execution.stderr, testCases),
        totalTime: Date.now() - started
      };
    } catch (error) {
      return {
        success: false,
        error: `Runtime error: ${error.stderr || error.message}`,
        results: []
      };
    }
  } finally {
    await cleanup(tempDir);
  }
}

export const __testUtils = { getTempDir, ensureTempDir, spawnAsync, parseResults };
