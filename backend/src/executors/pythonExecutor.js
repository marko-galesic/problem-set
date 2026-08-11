import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink, mkdir, readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { DEFAULT_CHALLENGE } from '../config/challenges.js';
import { getChallengeAssetContent, getHelperAssetType } from '../db/challengeContent.js';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TIMEOUT_MS = 10000;

function getTempDir(challengeId = DEFAULT_CHALLENGE) {
  return join(__dirname, '../../temp', challengeId, 'python');
}

async function ensureTempDir(challengeId = DEFAULT_CHALLENGE) {
  try {
    const tempDir = getTempDir(challengeId);
    await mkdir(tempDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

function spawnAsync(command, args, options, timeoutMs) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, options);
    let stdout = '';
    let stderr = '';
    let timeoutId = null;

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    const cleanup = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    if (timeoutMs) {
      timeoutId = setTimeout(() => {
        proc.kill('SIGTERM');
        setTimeout(() => {
          if (!proc.killed) {
            proc.kill('SIGKILL');
          }
        }, 1000);

        const err = new Error('Execution timeout');
        err.code = 143;
        err.stdout = stdout;
        err.stderr = stderr;
        err.cmd = `${command} ${args.join(' ')}`;
        reject(err);
      }, timeoutMs);
    }

    proc.on('close', (code, signal) => {
      cleanup();
      if (code === 0) {
        resolve({ stdout, stderr, code, signal });
      } else {
        const err = new Error(`Command failed with code ${code}`);
        err.code = code;
        err.signal = signal;
        err.stdout = stdout;
        err.stderr = stderr;
        err.cmd = `${command} ${args.join(' ')}`;
        reject(err);
      }
    });

    proc.on('error', (err) => {
      cleanup();
      reject(err);
    });
  });
}

async function findPythonExecutable() {
  const candidates = [];
  if (process.env.PYTHON_EXECUTABLE) {
    candidates.push(process.env.PYTHON_EXECUTABLE);
  }
  candidates.push('python3', 'python');

  for (const candidate of candidates) {
    try {
      await execAsync(`${candidate} --version`, { timeout: 2000 });
      return candidate;
    } catch {
      continue;
    }
  }
  return null;
}

function indentCode(code, spaces) {
  if (!code) {
    return '';
  }
  const pad = ' '.repeat(spaces);
  return code
    .split('\n')
    .map((line) => (line.trim().length > 0 ? pad + line : line))
    .join('\n');
}

function stripTripleQuotedStrings(code) {
  if (!code) {
    return '';
  }
  return code.replace(/("""[\s\S]*?"""|'''[\s\S]*?''')/g, '');
}

async function extractClassNameFromTemplate(challengeId) {
  try {
    const templateContent = await getChallengeAssetContent({
      challengeId,
      type: 'template',
      language: 'python'
    });
    if (!templateContent) {
      return null;
    }
    const sanitizedContent = stripTripleQuotedStrings(templateContent);
    const classPattern = /^\s*(?:#.*\n|\s*)*class\s+(\w+)\b/m;
    const match = sanitizedContent.match(classPattern);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  } catch {
    return null;
  }
}

function hasClassDefinition(userCode, className) {
  if (!userCode || !className) {
    return false;
  }
  const sanitizedCode = stripTripleQuotedStrings(userCode);
  const pattern = new RegExp(`\\bclass\\s+${className}\\b`);
  return pattern.test(sanitizedCode);
}

export async function executePythonCode(userCode, testCases, adapter, challengeId = DEFAULT_CHALLENGE) {
  if (!adapter) {
    throw new Error('Adapter is required for executePythonCode');
  }

  await ensureTempDir(challengeId);
  const TEMP_DIR = getTempDir(challengeId);

  let className = null;
  const templateClassName = await extractClassNameFromTemplate(challengeId);
  if (templateClassName) {
    className = templateClassName;
  } else if (adapter.getDefaultClassName) {
    className = adapter.getDefaultClassName();
  }

  if (!className) {
    throw new Error(`Could not determine class name for challenge ${challengeId}.`);
  }

  let processedUserCode = userCode || '';
  if (adapter.transformUserCode) {
    processedUserCode = adapter.transformUserCode(processedUserCode, testCases);
  }

  const helperFiles = ['TreeNode', 'ListNode'];
  const helperContents = [];

  for (const helper of helperFiles) {
    try {
      const helperContent = await getChallengeAssetContent({
        challengeId,
        type: getHelperAssetType(helper),
        language: 'python'
      });
      if (!helperContent) {
        throw new Error('missing helper');
      }
      if (!hasClassDefinition(processedUserCode, helper)) {
        helperContents.push(helperContent.trim());
      }
    } catch {
      // Helper file not found for this challenge
    }
  }

  const helperBlock = helperContents.length > 0
    ? `${helperContents.join('\n\n')}\n\n`
    : '';

  const serializerCode = adapter.generateSerializer();
  const comparatorCode = adapter.generateComparison
    ? adapter.generateComparison()
    : `def compare_results(actual, expected, actual_str, expected_str):
    return actual_str == expected_str
`;
  const inputHelpersCode = adapter.generateInputHelpers(testCases);
  const invocationCode = adapter.generateInvocation('parser');
  const invocationIndented = indentCode(invocationCode, 20);
  const needsParserInstance = invocationCode.includes('parser.');

  const expectedBuilders = testCases.map((tc, idx) => {
    const expectedCode = adapter.buildExpectedCode(tc.expected, '    ', 'expected');
    return `def get_expected_${idx}():\n${expectedCode}    return expected\n`;
  }).join('\n');

  const expectedList = testCases.map((_, idx) => `get_expected_${idx}`).join(', ');
  const serializerMethod = adapter.getSerializerMethod();
  const resultsFileName = `${className}_results_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.json`;
  const resultsPath = join(TEMP_DIR, resultsFileName);

  const pythonSource = `${helperBlock}${processedUserCode}

import sys
import time
import io
import json
from contextlib import redirect_stdout

RESULTS_PATH = ${JSON.stringify(resultsPath)}

${serializerCode}

${comparatorCode}

${inputHelpersCode}

${expectedBuilders}

EXPECTED_BUILDERS = [${expectedList}]

class TestClock:
    _mock_time = None

    @classmethod
    def current_time_millis(cls):
        if cls._mock_time is not None:
            return cls._mock_time
        return int(time.time() * 1000)

    @classmethod
    def set_current_time(cls, value):
        cls._mock_time = value

    @classmethod
    def reset(cls):
        cls._mock_time = None


def main():
    ${needsParserInstance ? `parser = ${className}()` : 'parser = None'}
    results = []

    for i in range(${testCases.length}):
        buffer = io.StringIO()
        with redirect_stdout(buffer):
            try:
                start_time = time.time()
                actual = None
                actual_error = None
                error_message = None

                try:
${invocationIndented}
                except Exception as exc:
                    actual_error = exc
                    error_message = f"ERROR in test {i} (method invocation): {type(exc).__name__}: {exc}"
                    print(error_message, file=sys.stderr)

                try:
                    expected = EXPECTED_BUILDERS[i]()
                except Exception:
                    expected = None

                actual_str = ${serializerMethod}(actual)
                expected_str = ${serializerMethod}(expected)
                passed = compare_results(actual, expected, actual_str, expected_str)
                duration_ms = int((time.time() - start_time) * 1000)
            except Exception as exc:
                actual_str = "null"
                expected_str = "null"
                passed = False
                duration_ms = 0
                error_message = f"ERROR in test {i}: {exc}"
                print(error_message, file=sys.stderr)

        stdout_value = buffer.getvalue()
        results.append((actual_str, expected_str, passed, duration_ms, stdout_value, error_message))

    results_payload = []
    for actual_str, expected_str, passed, duration_ms, stdout_value, error_message in results:
        results_payload.append({
            "actual": actual_str,
            "expected": expected_str,
            "passed": passed,
            "durationMs": duration_ms,
            "stdout": stdout_value,
            "error": error_message
        })

    try:
        with open(RESULTS_PATH, "w", encoding="utf-8") as results_file:
            json.dump({"results": results_payload}, results_file)
    except Exception as exc:
        print(f"ERROR writing results file: {exc}", file=sys.stderr)

    for i, (actual_str, expected_str, passed, duration_ms, stdout_value, _) in enumerate(results):
        print(f"TEST_{i}_ACTUAL:{actual_str}", file=sys.stderr)
        print(f"TEST_{i}_EXPECTED:{expected_str}", file=sys.stderr)
        print(f"TEST_{i}_RESULT:{'PASS' if passed else 'FAIL'}", file=sys.stderr)
        print(f"TEST_{i}_TIME:{duration_ms}", file=sys.stderr)
        print(f"TEST_{i}_STDOUT:{stdout_value}", file=sys.stderr)


if __name__ == "__main__":
    main()
`;

  const filePath = join(TEMP_DIR, `${className}_runner.py`);

  try {
    await writeFile(filePath, pythonSource, 'utf8');

    const pythonExecutable = await findPythonExecutable();
    if (!pythonExecutable) {
      return {
        success: false,
        error: 'Python runtime not found. Please install Python 3.',
        results: []
      };
    }

    let executionResult;
    const startTime = Date.now();
    try {
      executionResult = await spawnAsync(
        pythonExecutable,
        [filePath],
        { cwd: TEMP_DIR, env: process.env },
        TIMEOUT_MS
      );
    } catch (execErr) {
      const errorMsg = execErr.stderr || execErr.message || 'Execution failed';
      return {
        success: false,
        error: `Runtime error: ${errorMsg}`,
        results: []
      };
    }

    const stdout = executionResult.stdout || '';
    const stderr = executionResult.stderr || '';
    const totalTime = Date.now() - startTime;
    const fileResults = await readResultsFile(resultsPath, testCases, stderr);
    const output = fileResults ? '' : selectTestOutput(stdout, stderr);
    const results = fileResults || await parseTestResults(output, testCases, stderr);

    try {
      const files = await readdir(TEMP_DIR);
      await unlink(resultsPath).catch(() => {});
      const deletePromises = files
        .filter(file => file.endsWith('_runner.py'))
        .map(file => unlink(join(TEMP_DIR, file)).catch(() => {}));
      await Promise.all(deletePromises);
    } catch {
      // Ignore cleanup errors
    }

    return {
      success: true,
      results,
      totalTime
    };
  } catch (error) {
    try {
      const files = await readdir(TEMP_DIR).catch(() => []);
      await unlink(resultsPath).catch(() => {});
      const deletePromises = files
        .filter(file => file.endsWith('_runner.py'))
        .map(file => unlink(join(TEMP_DIR, file)).catch(() => {}));
      await Promise.all(deletePromises);
    } catch {
      // Ignore cleanup errors
    }

    return {
      success: false,
      error: error.message || 'Unknown error occurred',
      results: []
    };
  }
}

export const __testUtils = {
  getTempDir,
  ensureTempDir,
  spawnAsync,
  findPythonExecutable,
  indentCode,
  stripTripleQuotedStrings,
  extractClassNameFromTemplate,
  hasClassDefinition,
  readResultsFile,
  extractTestErrors
};

const TEST_RESULT_LINE = /^TEST_\d+_(ACTUAL|EXPECTED|RESULT|TIME|STDOUT):/;

function selectTestOutput(stdout, stderr) {
  const hasTestLines = (value) => value && value.split(/\r?\n/).some(line => TEST_RESULT_LINE.test(line));
  if (hasTestLines(stderr)) {
    return stderr;
  }
  if (hasTestLines(stdout)) {
    return stdout;
  }
  return stderr || stdout || '';
}

function stripTestResultLines(text = '') {
  if (!text || typeof text !== 'string') {
    return '';
  }
  return text
    .split(/\r?\n/)
    .filter(line => !TEST_RESULT_LINE.test(line))
    .join('\n');
}

function extractTestErrors(stderr = '', testCount = 0) {
  const testErrors = {};
  const errorText = stripTestResultLines(stderr);
  for (let i = 0; i < testCount; i++) {
    const errorStartPattern = `ERROR in test ${i} (method invocation):`;
    const errorStartIndex = errorText.indexOf(errorStartPattern);
    if (errorStartIndex !== -1) {
      const nextErrorPattern = `ERROR in test ${i + 1} (method invocation):`;
      const nextErrorIndex = errorText.indexOf(nextErrorPattern, errorStartIndex + 1);
      const errorEndIndex = nextErrorIndex !== -1 ? nextErrorIndex : errorText.length;
      const errorSection = errorText.substring(errorStartIndex, errorEndIndex);
      testErrors[i] = errorSection.trim();
    }
  }
  return testErrors;
}

async function readResultsFile(resultsPath, testCases, stderr = '') {
  try {
    const raw = await readFile(resultsPath, 'utf8');
    if (!raw) {
      return null;
    }
    const payload = JSON.parse(raw);
    const rawResults = Array.isArray(payload) ? payload : payload?.results;
    if (!Array.isArray(rawResults)) {
      return null;
    }
    const testErrors = extractTestErrors(stderr, testCases.length);
    return testCases.map((testCase, index) => {
      const entry = rawResults[index] || {};
      const durationMs = Number.isFinite(entry.durationMs)
        ? entry.durationMs
        : Number.parseInt(entry.durationMs ?? entry.executionTime ?? entry.timeMs, 10) || 0;
      return {
        testCase,
        actual: entry.actual ?? entry.actualStr ?? null,
        expected: entry.expected ?? entry.expectedStr ?? null,
        passed: typeof entry.passed === 'boolean' ? entry.passed : false,
        executionTime: durationMs,
        stdout: entry.stdout ?? entry.stdoutValue ?? '',
        error: entry.error ?? testErrors[index] ?? null
      };
    });
  } catch {
    return null;
  }
}

async function parseTestResults(output, testCases, stderr = '') {
  const results = [];
  const testErrors = extractTestErrors(stderr, testCases.length);

  if (!output || typeof output !== 'string') {
    for (let i = 0; i < testCases.length; i++) {
      results.push({
        testCase: testCases[i],
        actual: null,
        expected: null,
        passed: false,
        executionTime: 0,
        stdout: '',
        error: testErrors[i] || null
      });
    }
    return results;
  }

  const allLines = output.split(/\r?\n/);
  const lines = allLines.filter(line => line.trim().length > 0);

  for (let i = 0; i < testCases.length; i++) {
    const actualLine = lines.find(line => line.includes(`TEST_${i}_ACTUAL:`));
    const expectedLine = lines.find(line => line.includes(`TEST_${i}_EXPECTED:`));
    const resultLine = lines.find(line => line.includes(`TEST_${i}_RESULT:`));
    const timeLine = lines.find(line => line.includes(`TEST_${i}_TIME:`));

    const stdoutLineIndex = allLines.findIndex(line => line.includes(`TEST_${i}_STDOUT:`));

    let actualSerialized = null;
    let expectedSerialized = null;
    let validationResult = null;
    let executionTime = 0;
    let stdout = '';

    if (actualLine) {
      const match = actualLine.match(new RegExp(`TEST_${i}_ACTUAL:(.+)`));
      actualSerialized = match && match[1] ? match[1].trim() : actualLine.replace(`TEST_${i}_ACTUAL:`, '').trim();
    }

    if (expectedLine) {
      const match = expectedLine.match(new RegExp(`TEST_${i}_EXPECTED:(.+)`));
      expectedSerialized = match && match[1] ? match[1].trim() : expectedLine.replace(`TEST_${i}_EXPECTED:`, '').trim();
    }

    if (resultLine) {
      const match = resultLine.match(new RegExp(`TEST_${i}_RESULT:(.+)`));
      validationResult = match && match[1] ? match[1].trim() : resultLine.replace(`TEST_${i}_RESULT:`, '').trim();
    }

    if (timeLine) {
      const match = timeLine.match(new RegExp(`TEST_${i}_TIME:(.+)`));
      executionTime = match && match[1] ? parseInt(match[1].trim()) || 0 : parseInt(timeLine.replace(`TEST_${i}_TIME:`, '').trim()) || 0;
    }

    if (stdoutLineIndex >= 0) {
      const stdoutLine = allLines[stdoutLineIndex];
      const prefixMatch = stdoutLine.match(new RegExp(`TEST_${i}_STDOUT:(.*)`));
      const stdoutParts = [];

      if (prefixMatch) {
        if (prefixMatch[1]) {
          stdoutParts.push(prefixMatch[1]);
        }
        for (let j = stdoutLineIndex + 1; j < allLines.length; j++) {
          const nextLine = allLines[j];
          if (nextLine.match(/^TEST_\d+_(ACTUAL|EXPECTED|RESULT|TIME|STDOUT):/)) {
            break;
          }
          stdoutParts.push(nextLine);
        }
      } else {
        stdoutParts.push(stdoutLine.replace(`TEST_${i}_STDOUT:`, ''));
      }

      stdout = stdoutParts.join('\n');
    }

    const passed = validationResult === 'PASS';
    results.push({
      testCase: testCases[i],
      actual: actualSerialized,
      expected: expectedSerialized,
      passed,
      executionTime,
      stdout: stdout || '',
      error: testErrors[i] || null
    });
  }

  return results;
}
