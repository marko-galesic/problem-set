import { describe, expect, test } from '@jest/globals';
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { loadAdapter } from '../../adapters/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const testCasesDir = join(__dirname, '..', '..', 'testCases');

async function loadRunTests(testCaseFile) {
  const testCaseUrl = pathToFileURL(join(testCasesDir, testCaseFile)).href;
  const testCaseModule = await import(testCaseUrl);
  return testCaseModule.runTests || [];
}

async function snapshotAdapter(spec) {
  const adapter = await loadAdapter(spec.adapterPath);
  const runTests = await loadRunTests(spec.testCaseFile);
  const sampleSize = Math.min(spec.sampleSize ?? 2, runTests.length);
  const testCases = runTests.slice(0, sampleSize);
  const sample = testCases[0] ?? {};

  return {
    name: spec.name,
    adapterPath: spec.adapterPath,
    testCaseFile: spec.testCaseFile,
    extractInput: adapter.extractInput(sample),
    expectedCode: adapter.buildExpectedCode(sample.expected),
    serializer: adapter.generateSerializer(),
    invocation: adapter.generateInvocation('solver'),
    inputHelpers: adapter.generateInputHelpers(testCases),
    returnType: adapter.getReturnType(),
    serializerMethod: adapter.getSerializerMethod(),
    defaultClassName: adapter.getDefaultClassName()
  };
}

const JAVA_CASES = [
  {
    name: 'twoSum',
    adapterPath: './adapters/twoSumAdapter.js',
    testCaseFile: 'twoSumTests.js',
    sampleSize: 2
  },
  {
    name: 'binarySearch',
    adapterPath: './adapters/binarySearchAdapter.js',
    testCaseFile: 'binarySearchTests.js',
    sampleSize: 2
  },
  {
    name: 'maximumAverageSubarrayI',
    adapterPath: './adapters/maximumAverageSubarrayIAdapter.js',
    testCaseFile: 'maximumAverageSubarrayITests.js',
    sampleSize: 2
  },
  {
    name: 'minimumWindowSubstring',
    adapterPath: './adapters/minimumWindowSubstringAdapter.js',
    testCaseFile: 'minimumWindowSubstringTests.js',
    sampleSize: 2
  },
  {
    name: 'letterCombinationsOfAPhoneNumber',
    adapterPath: './adapters/letterCombinationsOfAPhoneNumberAdapter.js',
    testCaseFile: 'letterCombinationsOfAPhoneNumberTests.js',
    sampleSize: 2
  },
  {
    name: 'groupAnagrams',
    adapterPath: './adapters/groupAnagramsAdapter.js',
    testCaseFile: 'groupAnagramsTests.js',
    sampleSize: 1
  },
  {
    name: 'setMatrixZeroes',
    adapterPath: './adapters/setMatrixZeroesAdapter.js',
    testCaseFile: 'setMatrixZeroesTests.js',
    sampleSize: 1
  },
  {
    name: 'sudokuSolver',
    adapterPath: './adapters/sudokuSolverAdapter.js',
    testCaseFile: 'sudokuSolverTests.js',
    sampleSize: 1
  },
  {
    name: 'wordSearch',
    adapterPath: './adapters/wordSearchAdapter.js',
    testCaseFile: 'wordSearchTests.js',
    sampleSize: 1
  }
];

const JAVASCRIPT_CASES = JAVA_CASES.map((spec) => ({
  ...spec,
  adapterPath: spec.adapterPath.replace('./adapters/', './adapters/javascript/')
}));

const PYTHON_CASES = JAVA_CASES.map((spec) => ({
  ...spec,
  adapterPath: spec.adapterPath.replace('./adapters/', './adapters/python/')
}));

describe('adapter outputs (characterization)', () => {
  describe('java adapters', () => {
    for (const spec of JAVA_CASES) {
      test(spec.name, async () => {
        const output = await snapshotAdapter(spec);
        expect(output).toMatchSnapshot();
      });
    }
  });

  describe('javascript adapters', () => {
    for (const spec of JAVASCRIPT_CASES) {
      test(spec.name, async () => {
        const output = await snapshotAdapter(spec);
        expect(output).toMatchSnapshot();
      });
    }
  });

  describe('python adapters', () => {
    for (const spec of PYTHON_CASES) {
      test(spec.name, async () => {
        const output = await snapshotAdapter(spec);
        expect(output).toMatchSnapshot();
      });
    }
  });
});
