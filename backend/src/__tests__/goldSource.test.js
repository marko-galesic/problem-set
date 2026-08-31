import { describe, test, expect } from '@jest/globals';
import { execSync } from 'child_process';
import { readFile } from 'fs/promises';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { executeJavaCode } from '../executors/javaExecutor.js';
import { executeJavaScriptCode } from '../executors/javascriptExecutor.js';
import { executeTypeScriptCode } from '../executors/typescriptExecutor.js';
import { executePythonCode } from '../executors/pythonExecutor.js';
import { executeCppCode } from '../executors/cppExecutor.js';
import { loadAdapter } from '../adapters/index.js';
import { CHALLENGES } from '../server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const srcDir = resolve(__dirname, '..'); // Go up from __tests__ to src/

function getChangedFiles(baseRef) {
  const files = new Set();
  const commands = [
    `git diff --name-only ${baseRef}...HEAD`,
    'git diff --name-only',
    'git diff --name-only --cached',
    'git ls-files --others --exclude-standard'
  ];

  for (const command of commands) {
    try {
      const output = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      output
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .forEach(file => files.add(file));
    } catch (error) {
      continue;
    }
  }

  return Array.from(files);
}

function getChangedChallengeIds() {
  const baseRef = process.env.GOLD_SOURCE_BASE || 'origin/main';
  const files = getChangedFiles(baseRef);
  const ids = new Set();

  files.forEach((file) => {
    const match = file.match(/^data\/([^/]+)\//);
    if (match?.[1]) {
      ids.add(match[1]);
    }
  });

  return Array.from(ids);
}

function resolveChallengeSelection() {
  const explicitList = process.env.GOLD_SOURCE_CHALLENGES;
  if (explicitList) {
    const ids = explicitList
      .split(',')
      .map(value => value.trim())
      .filter(Boolean);
    return { ids, mode: 'explicit' };
  }

  const mode = (process.env.GOLD_SOURCE_MODE || 'changed').toLowerCase();
  if (mode === 'all' || mode === 'full') {
    return { ids: null, mode: 'all' };
  }
  if (mode === 'changed' || mode === 'new') {
    return { ids: getChangedChallengeIds(), mode };
  }

  return { ids: null, mode: 'all' };
}

const selection = resolveChallengeSelection();
const requestedIds = selection.ids;
const challengeIds = requestedIds
  ? requestedIds.filter((id) => Boolean(CHALLENGES[id]))
  : Object.keys(CHALLENGES);
const unknownIds = requestedIds ? requestedIds.filter(id => !CHALLENGES[id]) : [];
const shouldSkip = requestedIds && challengeIds.length === 0;

if (unknownIds.length > 0) {
  console.warn(`Gold source test skipped unknown challenge ids: ${unknownIds.join(', ')}`);
}

/**
 * Reads the Golden.java file for a given challenge
 */
async function readGoldSource(challengeId, language = 'java') {
  const challenge = CHALLENGES[challengeId];
  if (!challenge) {
    throw new Error(`Unknown challenge: ${challengeId}`);
  }

  const filenameMap = {
    java: 'Golden.java',
    javascript: 'Golden.js',
    typescript: 'Golden.ts',
    python: 'Golden.py',
    cpp: 'Golden.cpp'
  };
  const filename = filenameMap[language] || 'Golden.java';
  const goldenPath = join(__dirname, '../../../data', challenge.folder, filename);
  return await readFile(goldenPath, 'utf8');
}

/**
 * Loads test cases for a challenge
 */
function getAdapterPath(challenge, language) {
  if (challenge.adapter?.startsWith('standard:')) {
    const parts = challenge.adapter.split(':');
    const adapterKey = parts[1];
    if (adapterKey) {
      return `standard:${adapterKey}:${language}`;
    }
  }
  if (language === 'javascript' && challenge.adapter.startsWith('./adapters/')) {
    return challenge.adapter.replace('./adapters/', './adapters/javascript/');
  }
  if (language === 'typescript' && challenge.adapter.startsWith('./adapters/')) {
    return challenge.adapter.replace('./adapters/', './adapters/typescript/');
  }
  if (language === 'python' && challenge.adapter.startsWith('./adapters/')) {
    return challenge.adapter.replace('./adapters/', './adapters/python/');
  }
  return challenge.adapter;
}

async function loadTestCases(challengeId, language = 'java') {
  const challenge = CHALLENGES[challengeId];
  // Resolve testFile path relative to src/ directory (where server.js is)
  const testFilePath = challenge.testFile.startsWith('./') 
    ? resolve(srcDir, challenge.testFile.substring(2))
    : resolve(srcDir, challenge.testFile);
  const testFileUrl = `file://${testFilePath}`;
  const testModule = await import(testFileUrl);
  let submitTests = testModule.submitTests || [];
  
  // Load adapter to check if it has preprocessing
  const adapterPath = getAdapterPath(challenge, language);
  const adapter = await loadAdapter(adapterPath);
  
  // Apply adapter preprocessing if available
  if (adapter.preprocessTestCases) {
    submitTests = adapter.preprocessTestCases(submitTests);
  }
  
  return { submitTests, adapter };
}

async function executeGoldSource(language, code, tests, adapter, challengeId) {
  if (language === 'javascript') {
    return await executeJavaScriptCode(code, tests, adapter, challengeId);
  }
  if (language === 'typescript') {
    return await executeTypeScriptCode(code, tests, adapter, challengeId);
  }
  if (language === 'python') {
    return await executePythonCode(code, tests, adapter, challengeId);
  }
  if (language === 'cpp') {
    return await executeCppCode(code, tests, adapter, challengeId);
  }
  return await executeJavaCode(code, tests, adapter, challengeId);
}

describe('Gold Source Validation', () => {
  if (shouldSkip) {
    test.skip('no changed challenges detected for gold source validation', () => {});
    return;
  }

  // Test each challenge's gold source
  for (const challengeId of challengeIds) {
    const challenge = CHALLENGES[challengeId];
    
    describe(challenge.name, () => {
      test('gold source should pass all submit tests', async () => {
        const languages = challenge.languages || ['java', 'javascript', 'typescript', 'python'];
        const languageRuns = await Promise.all(languages.map(async (language) => {
          // Read the gold source
          const goldSource = await readGoldSource(challengeId, language);
          expect(goldSource).toBeTruthy();
          expect(goldSource.length).toBeGreaterThan(0);

          // Load test cases and adapter
          const { submitTests, adapter } = await loadTestCases(challengeId, language);
          expect(submitTests.length).toBeGreaterThan(0);
          expect(adapter).toBeTruthy();

          // Execute the gold source against all submit tests
          const result = await executeGoldSource(
            language,
            goldSource,
            submitTests,
            adapter,
            challengeId
          );

          return { language, submitTests, result };
        }));

        for (const { language, submitTests, result } of languageRuns) {
          // Verify execution succeeded
          expect(result.success).toBe(true);
          expect(result.error).toBeUndefined();

          // Verify all tests passed
          expect(result.results).toBeDefined();
          expect(result.results.length).toBe(submitTests.length);

          // Check each test result
          const failedTests = result.results.filter(r => !r.passed);
          if (failedTests.length > 0) {
            const failureDetails = failedTests.map(r => {
              const testCase = r.testCase;
              return {
                testId: testCase?.id,
                testName: testCase?.name,
                actual: r.actual,
                expected: r.expected,
                error: r.error
              };
            });

            console.error(`Gold source failed ${failedTests.length} test(s) for ${challenge.name} (${language}):`,
              JSON.stringify(failureDetails, null, 2));
          }

          expect(failedTests.length).toBe(0);
        }
      }, 240000); // Coverage across every configured language can be slow.
    });
  }
  
  // Optional: Test that all challenges have a Golden file per language
  test('all challenges should have configured Golden sources', async () => {
    for (const challengeId of challengeIds) {
      const languages = (CHALLENGES[challengeId].languages
        || ['java', 'javascript', 'typescript', 'python'])
        .filter((language) => language !== 'java');
      for (const language of languages) {
        const goldSource = await readGoldSource(challengeId, language);
        expect(goldSource).toBeTruthy();
        expect(goldSource.length).toBeGreaterThan(0);
      }
    }
  });
});
