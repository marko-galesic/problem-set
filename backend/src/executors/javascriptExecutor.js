import { spawn } from 'child_process';
import { writeFile, unlink, mkdir, readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { DEFAULT_CHALLENGE } from '../server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TIMEOUT_MS = 10000;

function getTempDir(challengeId = DEFAULT_CHALLENGE) {
  return join(__dirname, '../../temp', challengeId, 'javascript');
}

async function ensureTempDir(challengeId = DEFAULT_CHALLENGE) {
  try {
    const tempDir = getTempDir(challengeId);
    await mkdir(tempDir, { recursive: true });
  } catch {
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

function stripBlockComments(code) {
  if (!code) {
    return '';
  }
  return code.replace(/\/\*[\s\S]*?\*\//g, '');
}

async function extractClassNameFromTemplate(challengeId) {
  try {
    const templatePath = join(__dirname, '../../../data', challengeId, 'template.js');
    const templateContent = await readFile(templatePath, 'utf8');
    const sanitizedContent = stripBlockComments(templateContent);
    const classPattern = /^\s*(?:\/\/.*\n|\s*)*class\s+(\w+)\b/m;
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
  const sanitized = stripBlockComments(userCode);
  const pattern = new RegExp(`\\bclass\\s+${className}\\b`);
  return pattern.test(sanitized);
}

export async function executeJavaScriptCode(userCode, testCases, adapter, challengeId = DEFAULT_CHALLENGE) {
  if (!adapter) {
    throw new Error('Adapter is required for executeJavaScriptCode');
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

  const helperFiles = ['TreeNode', 'ListNode', 'Node', 'AttrResult'];
  const helperContents = [];
  for (const helper of helperFiles) {
    const helperPath = join(__dirname, '../../../data', challengeId, `${helper}.js`);
    try {
      const helperContent = await readFile(helperPath, 'utf8');
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
  const inputHelpersCode = adapter.generateInputHelpers(testCases);
  const invocationCode = adapter.generateInvocation('parser');
  const needsParserInstance = invocationCode.includes('parser.');

  const expectedBuilders = testCases.map((tc, idx) => {
    const expectedCode = adapter.buildExpectedCode(tc.expected, '  ', 'expected');
    return `function getExpected_${idx}() {\n${expectedCode}  return expected;\n}\n`;
  }).join('\n');

  const expectedList = testCases.map((_, idx) => `getExpected_${idx}`).join(', ');
  const serializerMethod = adapter.getSerializerMethod();

  const jsSource = `${helperBlock}${processedUserCode}

${serializerCode}

${inputHelpersCode}

${expectedBuilders}

const EXPECTED_BUILDERS = [${expectedList}];

class TestClock {
  static _mockTime = null;
  static currentTimeMillis() {
    if (TestClock._mockTime !== null) {
      return TestClock._mockTime;
    }
    return Date.now();
  }
  static setCurrentTime(value) {
    TestClock._mockTime = value;
  }
  static reset() {
    TestClock._mockTime = null;
  }
}

function captureStdout(callback) {
  const originalWrite = process.stdout.write.bind(process.stdout);
  let buffer = '';
  process.stdout.write = (chunk, encoding, cb) => {
    buffer += chunk.toString();
    if (typeof cb === 'function') cb();
    return true;
  };
  try {
    callback();
  } finally {
    process.stdout.write = originalWrite;
  }
  return buffer;
}

function main() {
  const parser = ${needsParserInstance ? `new ${className}()` : 'null'};
  const results = [];
  for (let i = 0; i < ${testCases.length}; i++) {
    let actual = null;
    let actualError = null;
    let expected = null;
    let expectedError = null;
    let actualStr = "null";
    let expectedStr = "null";
    let passed = false;
    let durationMs = 0;
    let stdoutValue = '';
    stdoutValue = captureStdout(() => {
      const startTime = Date.now();
      try {
        try {
          ${invocationCode}
        } catch (err) {
          actualError = err;
          console.error(\`ERROR in test \${i} (method invocation): \${err.name}: \${err.message}\`);
        }
        try {
          expected = EXPECTED_BUILDERS[i]();
        } catch (err) {
          expectedError = err;
        }
        actualStr = ${serializerMethod}(actual);
        expectedStr = ${serializerMethod}(expected);
        passed = actualStr === expectedStr;
      } catch (err) {
        actualStr = "null";
        expectedStr = "null";
        passed = false;
        console.error(\`ERROR in test \${i}: \${err.message}\`);
      } finally {
        durationMs = Date.now() - startTime;
      }
    });
    results.push({ actualStr, expectedStr, passed, durationMs, stdoutValue, actualError, expectedError });
  }

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    console.log(\`TEST_\${i}_ACTUAL:\${result.actualStr}\`);
    console.log(\`TEST_\${i}_EXPECTED:\${result.expectedStr}\`);
    console.log(\`TEST_\${i}_RESULT:\${result.passed ? 'PASS' : 'FAIL'}\`);
    console.log(\`TEST_\${i}_TIME:\${result.durationMs}\`);
    console.log(\`TEST_\${i}_STDOUT:\${result.stdoutValue || ''}\`);
  }
}

main();
`;

  const filePath = join(TEMP_DIR, `${className}_runner.js`);

  try {
    await writeFile(filePath, jsSource, 'utf8');
    const nodeExecutable = process.execPath || 'node';

    let executionResult;
    const startTime = Date.now();
    try {
      executionResult = await spawnAsync(
        nodeExecutable,
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

    const output = executionResult.stdout || '';
    const stderr = executionResult.stderr || '';
    const totalTime = Date.now() - startTime;
    const results = await parseTestResults(output, testCases, stderr);

    try {
      const files = await readdir(TEMP_DIR);
      const deletePromises = files
        .filter(file => file.endsWith('_runner.js'))
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
      const deletePromises = files
        .filter(file => file.endsWith('_runner.js'))
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

async function parseTestResults(output, testCases, stderr = '') {
  const results = [];
  const testErrors = {};

  for (let i = 0; i < testCases.length; i++) {
    const errorStartPattern = `ERROR in test ${i} (method invocation):`;
    const errorStartIndex = stderr.indexOf(errorStartPattern);
    if (errorStartIndex !== -1) {
      const nextErrorPattern = `ERROR in test ${i + 1} (method invocation):`;
      const nextErrorIndex = stderr.indexOf(nextErrorPattern, errorStartIndex + 1);
      const errorEndIndex = nextErrorIndex !== -1 ? nextErrorIndex : stderr.length;
      const errorSection = stderr.substring(errorStartIndex, errorEndIndex);
      testErrors[i] = errorSection.trim();
    }
  }

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
          if (nextLine.match(/^TEST_\\d+_(ACTUAL|EXPECTED|RESULT|TIME|STDOUT):/)) {
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
