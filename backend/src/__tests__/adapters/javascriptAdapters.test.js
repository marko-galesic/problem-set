import { beforeAll, describe, expect, test } from '@jest/globals';
import { readdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { createStandardAdapter } from '../../adapters/standardAdapterFactory.js';
import { standardAdapterDefinitions } from '../../adapters/standardAdapterDefinitions.js';
import {
  buildCharGridInputHelper,
  buildExpectedBooleanCode,
  buildExpectedDoubleCode,
  buildExpectedIntCode,
  buildExpectedListCode,
  buildExpectedStringCode,
  buildGridInputHelper,
  buildIntArrayInputHelper,
  buildIntScalarInputHelper,
  buildStringInputHelper,
  serializeBoolean,
  serializeDouble,
  serializeInt,
  serializeIntArray,
  serializeString
} from '../../adapters/helpers/javascript.js';
import invertBinaryTreeAdapter from '../../adapters/javascript/invertBinaryTreeAdapter.js';
import lruCacheAdapter from '../../adapters/javascript/lruCacheAdapter.js';
import paginatedArticleStatsAdapter from '../../adapters/javascript/paginatedArticleStatsAdapter.js';
import reverseLinkedListAdapter from '../../adapters/javascript/reverseLinkedListAdapter.js';
import { runTests as invertBinaryTreeTests } from '../../testCases/invertBinaryTreeTests.js';
import { runTests as lruCacheTests } from '../../testCases/lrucachewithttl.js';
import { runTests as paginatedArticleStatsTests } from '../../testCases/paginatedArticleStatsTests.js';
import { runTests as reverseLinkedListTests } from '../../testCases/reverseLinkedListTests.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const adaptersDir = join(__dirname, '../../adapters/javascript');
const testCasesDir = join(__dirname, '../../testCases');
const standardKeys = new Set(
  Object.keys(standardAdapterDefinitions).filter((key) => key !== 'topKFrequentElements')
);

const specialTestCaseFiles = {
  lruCacheAdapter: 'lrucachewithttl.js'
};

function getTestCaseFile(adapterFile) {
  const adapterBase = adapterFile.replace(/\.js$/, '');
  if (specialTestCaseFiles[adapterBase]) {
    return specialTestCaseFiles[adapterBase];
  }
  return `${adapterBase.replace(/Adapter$/, '')}Tests.js`;
}

async function loadAdapterFixtures() {
  const adapterFiles = (await readdir(adaptersDir))
    .filter((file) => file.endsWith('Adapter.js'))
    .sort();

  return Promise.all(
    adapterFiles.map(async (file) => {
      const adapterBase = file.replace(/Adapter\\.js$/, '');
      let adapter;
      if (standardKeys.has(adapterBase)) {
        adapter = createStandardAdapter(standardAdapterDefinitions[adapterBase], 'javascript');
      } else {
        const adapterUrl = pathToFileURL(join(adaptersDir, file)).href;
        const adapterModule = await import(adapterUrl);
        adapter = adapterModule.default || adapterModule;
      }

      const testCaseFile = getTestCaseFile(file);
      const testCaseUrl = pathToFileURL(join(testCasesDir, testCaseFile)).href;
      const testCaseModule = await import(testCaseUrl);
      const runTests = testCaseModule.runTests || [];

      return {
        adapter,
        file,
        runTests,
        testCaseFile
      };
    })
  );
}

describe('javascript adapter helpers', () => {
  test('buildExpected helpers emit JS literals', () => {
    const intCode = buildExpectedIntCode(7);
    const doubleCode = buildExpectedDoubleCode(Number.POSITIVE_INFINITY);
    const boolCode = buildExpectedBooleanCode(false);
    const stringCode = buildExpectedStringCode('a"b');
    const listCode = buildExpectedListCode(null);

    expect(intCode).toContain('const expected = 7');
    expect(doubleCode).toContain('const expected = 0');
    expect(boolCode).toContain('const expected = false');
    expect(stringCode).toContain('const expected = "a\\"b"');
    expect(listCode).toContain('const expected = null');
  });

  test('serializer helpers emit expected function shells', () => {
    const intSerializer = serializeInt();
    const doubleSerializer = serializeDouble();
    const booleanSerializer = serializeBoolean();
    const stringSerializer = serializeString();
    const intArraySerializer = serializeIntArray();

    expect(intSerializer).toContain('function serializeInt');
    expect(doubleSerializer).toContain('function serializeDouble');
    expect(doubleSerializer).toContain('toFixed(5)');
    expect(booleanSerializer).toContain('function serializeBoolean');
    expect(stringSerializer).toContain('function serializeString');
    expect(stringSerializer).toContain('replace');
    expect(intArraySerializer).toContain('function serializeIntArray');
  });

  test('input helpers emit test input builders', () => {
    const testCases = [
      { nums: [1, 2], target: 3, s: 'a\nb', grid: [[1, 0], [0, 1]], charGrid: [['a', 'b']] },
      { nums: [], target: 0, s: 'x', grid: [], charGrid: [] }
    ];

    const listHelper = buildIntArrayInputHelper(testCases, 'nums', 'getNums');
    const intHelper = buildIntScalarInputHelper(testCases, 'target', 'getTarget');
    const stringHelper = buildStringInputHelper(testCases, 's', 'getString');
    const gridHelper = buildGridInputHelper(testCases, 'grid', 'getGrid');
    const charGridHelper = buildCharGridInputHelper(testCases, 'charGrid', 'getCharGrid');

    expect(listHelper).toContain('function getNums');
    expect(listHelper).toContain('[1,2]');
    expect(intHelper).toContain('function getTarget');
    expect(intHelper).toContain('3');
    expect(stringHelper).toContain('function getString');
    expect(stringHelper).toContain('a\\n');
    expect(gridHelper).toContain('function getGrid');
    expect(gridHelper).toContain('row.slice()');
    expect(charGridHelper).toContain('function getCharGrid');
  });
});

describe('javascript adapters', () => {
  let fixtures = [];

  beforeAll(async () => {
    fixtures = await loadAdapterFixtures();
  });

  test('generate expected code fragments for each adapter', () => {
    expect(fixtures.length).toBeGreaterThan(0);

    for (const { adapter, file, runTests, testCaseFile } of fixtures) {
      expect(Array.isArray(runTests)).toBe(true);
      expect(runTests.length).toBeGreaterThan(0);

      const testCase = runTests[0] ?? {};
      const extracted = adapter.extractInput(testCase);
      expect(extracted).toBeTruthy();
      expect(typeof extracted).toBe('object');

      const expectedCode = adapter.buildExpectedCode(testCase.expected);
      expect(typeof expectedCode).toBe('string');
      expect(expectedCode).toContain('expected');

      const serializer = adapter.generateSerializer();
      expect(typeof serializer).toBe('string');
      expect(serializer.length).toBeGreaterThan(0);

      const invocation = adapter.generateInvocation('solver');
      expect(typeof invocation).toBe('string');
      expect(invocation).toContain('actual');

      const inputHelpers = adapter.generateInputHelpers(runTests);
      expect(typeof inputHelpers).toBe('string');
      expect(inputHelpers.length).toBeGreaterThan(0);

      const returnType = adapter.getReturnType();
      expect(typeof returnType).toBe('string');
      expect(returnType.length).toBeGreaterThan(0);

      const serializerMethod = adapter.getSerializerMethod();
      expect(typeof serializerMethod).toBe('string');
      expect(serializerMethod.length).toBeGreaterThan(0);

      if (typeof adapter.getDefaultClassName === 'function') {
        const defaultClassName = adapter.getDefaultClassName();
        expect(typeof defaultClassName).toBe('string');
        expect(defaultClassName.length).toBeGreaterThan(0);
      }

      expect(file).toBeTruthy();
      expect(testCaseFile).toBeTruthy();
    }
  });
});

describe('javascript adapters (special cases)', () => {
  test('tree adapters emit tree helpers and serializer', () => {
    const serializer = invertBinaryTreeAdapter.generateSerializer();
    const inputHelpers = invertBinaryTreeAdapter.generateInputHelpers(invertBinaryTreeTests);
    const invocation = invertBinaryTreeAdapter.generateInvocation('solver');

    expect(serializer).toContain('serializeTreeNode');
    expect(inputHelpers).toContain('TreeNode');
    expect(inputHelpers).toContain('buildTree');
    expect(invocation).toContain('invertTree');
  });

  test('list adapters emit list helpers and serializer', () => {
    const serializer = reverseLinkedListAdapter.generateSerializer();
    const inputHelpers = reverseLinkedListAdapter.generateInputHelpers(reverseLinkedListTests);
    const invocation = reverseLinkedListAdapter.generateInvocation('solver');

    expect(serializer).toContain('serializeListNode');
    expect(inputHelpers).toContain('ListNode');
    expect(inputHelpers).toContain('getTestHead');
    expect(invocation).toContain('reverseList');
  });

  test('lru cache adapter supports time control and preprocessing', () => {
    const serializer = lruCacheAdapter.generateSerializer();
    const inputHelpers = lruCacheAdapter.generateInputHelpers(lruCacheTests);
    const invocation = lruCacheAdapter.generateInvocation('solver');

    expect(serializer).toContain('serializeResult');
    expect(inputHelpers).toContain('class Step');
    expect(inputHelpers).toContain('getTestSteps');
    expect(invocation).toContain('TestClock');
    expect(invocation).toContain('LRUCache');

    const processed = lruCacheAdapter.preprocessTestCases([
      { steps: [{ op: 'get', args: [1], expected: 4 }] }
    ]);
    expect(processed[0].expected).toBe(4);

    const noTime = lruCacheAdapter.transformUserCode('const now = Date.now();', [
      { steps: [{ op: 'put', args: [1, 1] }] }
    ]);
    expect(noTime).toBe('const now = Date.now();');

    const withTime = lruCacheAdapter.transformUserCode('const now = Date.now();', [
      { steps: [{ op: 'put', args: [1, 1], at: 10 }] }
    ]);
    expect(withTime).toContain('TestClock.currentTimeMillis()');

    expect(lruCacheAdapter.checkUserDefinedClasses('class LRUCache {}').hasLRUCache).toBe(true);
    expect(lruCacheAdapter.checkUserDefinedClasses('class Other {}').hasLRUCache).toBe(false);
    expect(lruCacheAdapter.generateHelperClasses()).toBe('');
  });

  test('paginated article stats adapter includes request mocks', () => {
    const serializer = paginatedArticleStatsAdapter.generateSerializer();
    const inputHelpers = paginatedArticleStatsAdapter.generateInputHelpers(paginatedArticleStatsTests);
    const invocation = paginatedArticleStatsAdapter.generateInvocation('solver');

    expect(serializer).toContain('serializeStatsObject');
    expect(inputHelpers).toContain('ApiClient');
    expect(inputHelpers).toContain('fetchPage');
    expect(invocation).toContain('ApiClient.setProvider');
    expect(invocation).toContain('analyzeArticles');
  });
});
