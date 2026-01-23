import { beforeAll, describe, expect, test } from '@jest/globals';
import { readdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { createAdapter } from '../../adapters/baseAdapter.js';
import { createStandardAdapter } from '../../adapters/standardAdapterFactory.js';
import { standardAdapterDefinitions } from '../../adapters/standardAdapterDefinitions.js';
import {
  buildCharGridInputHelper,
  buildExpectedBooleanCode,
  buildExpectedDoubleCode,
  buildExpectedIntArrayCode,
  buildExpectedIntCode,
  buildExpectedStringCode,
  buildIntArrayInputHelper,
  buildIntGridInputHelper,
  buildIntScalarInputHelper,
  buildStringInputHelper,
  serializeBoolean,
  serializeDouble,
  serializeInt,
  serializeIntArray,
  serializeString
} from '../../adapters/helpers/java.js';
import invertBinaryTreeAdapter from '../../adapters/invertBinaryTreeAdapter.js';
import lruCacheAdapter from '../../adapters/lruCacheAdapter.js';
import paginatedArticleStatsAdapter from '../../adapters/paginatedArticleStatsAdapter.js';
import reverseLinkedListAdapter from '../../adapters/reverseLinkedListAdapter.js';
import { runTests as invertBinaryTreeTests } from '../../testCases/invertBinaryTreeTests.js';
import { runTests as lruCacheTests } from '../../testCases/lrucachewithttl.js';
import { runTests as paginatedArticleStatsTests } from '../../testCases/paginatedArticleStatsTests.js';
import { runTests as reverseLinkedListTests } from '../../testCases/reverseLinkedListTests.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const adaptersDir = join(__dirname, '../../adapters');
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
    .filter((file) => file.endsWith('Adapter.js') && file !== 'baseAdapter.js')
    .sort();

  return Promise.all(
    adapterFiles.map(async (file) => {
      const adapterBase = file.replace(/Adapter\\.js$/, '');
      let adapter;
      if (standardKeys.has(adapterBase)) {
        adapter = createStandardAdapter(standardAdapterDefinitions[adapterBase], 'java');
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

describe('java adapter helpers', () => {
  test('buildExpected helpers emit Java literals', () => {
    const intCode = buildExpectedIntCode(null);
    const doubleCode = buildExpectedDoubleCode(Number.NaN);
    const boolCode = buildExpectedBooleanCode(undefined);
    const stringCode = buildExpectedStringCode('a"b');
    const intArrayCode = buildExpectedIntArrayCode([1, 2]);

    expect(intCode).toContain('int expected = 0');
    expect(doubleCode).toContain('double expected = 0.0');
    expect(boolCode).toContain('boolean expected = false');
    expect(stringCode).toContain('String expected = "a\\"b"');
    expect(intArrayCode).toContain('new int[] { 1, 2 }');
  });

  test('serializer helpers emit expected methods', () => {
    const intSerializer = serializeInt();
    const doubleSerializer = serializeDouble();
    const booleanSerializer = serializeBoolean();
    const stringSerializer = serializeString();
    const intArraySerializer = serializeIntArray();

    expect(intSerializer).toContain('serializeInt');
    expect(doubleSerializer).toContain('serializeDouble');
    expect(doubleSerializer).toContain('%.5f');
    expect(booleanSerializer).toContain('serializeBoolean');
    expect(stringSerializer).toContain('serializeString');
    expect(stringSerializer).toContain('replace');
    expect(intArraySerializer).toContain('serializeIntArray');
  });

  test('input helpers emit Java builders', () => {
    const testCases = [
      { nums: [1, 2], target: 3, s: 'a\nb', grid: [[1, 0], [0, 1]], chars: [['a', 'b']] },
      { nums: [], target: 0, s: 'x', grid: [], chars: [1, 2] }
    ];

    const listHelper = buildIntArrayInputHelper(testCases, 'nums', 'getNums');
    const intHelper = buildIntScalarInputHelper(testCases, 'target', 'getTarget', 'targets');
    const stringHelper = buildStringInputHelper(testCases, 's', 'getString', 'full');
    const charGridHelper = buildCharGridInputHelper(testCases, 'chars', 'getCharGrid');
    const intGridHelper = buildIntGridInputHelper(testCases, 'grid', 'getGrid');

    expect(listHelper).toContain('int[][] inputs');
    expect(listHelper).toContain('new int[] { 1, 2 }');
    expect(intHelper).toContain('int[] targets');
    expect(intHelper).toContain('3');
    expect(stringHelper).toContain('String[] inputs');
    expect(stringHelper).toContain('\\n');
    expect(charGridHelper).toContain('char[][][] grids');
    expect(charGridHelper).toContain('new char[0]');
    expect(intGridHelper).toContain('int[][][] grids');
    expect(intGridHelper).toContain('new int[0]');
  });
});

describe('base adapter defaults', () => {
  test('createAdapter supplies default hooks', () => {
    const adapter = createAdapter({});
    expect(adapter.checkUserDefinedClasses()).toEqual({});
    expect(adapter.generateHelperClasses()).toBe('');
    expect(adapter.preprocessTestCases([1])).toEqual([1]);
    expect(adapter.transformUserCode('code')).toBe('code');
    expect(adapter.getDefaultClassName()).toBe('Solution');
    expect(adapter.extractInput({ foo: 'bar' })).toEqual({ foo: 'bar' });
    expect(adapter.buildExpectedCode()).toBe('');
    expect(adapter.generateSerializer()).toBe('');
    expect(adapter.generateInvocation()).toBe('');
    expect(adapter.generateInputHelpers()).toBe('');
    expect(adapter.getReturnType()).toBe('');
    expect(adapter.getSerializerMethod()).toBe('');
  });
});

describe('java adapters', () => {
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

describe('java adapters (special cases)', () => {
  test('tree adapters emit tree helpers and serializer', () => {
    const serializer = invertBinaryTreeAdapter.generateSerializer();
    const inputHelpers = invertBinaryTreeAdapter.generateInputHelpers(invertBinaryTreeTests);
    const invocation = invertBinaryTreeAdapter.generateInvocation('solver');

    expect(serializer).toContain('serializeTreeNode');
    expect(inputHelpers).toContain('buildTree');
    expect(inputHelpers).toContain('TreeNode');
    expect(invocation).toContain('invertTree');
  });

  test('list adapters emit list helpers and serializer', () => {
    const serializer = reverseLinkedListAdapter.generateSerializer();
    const inputHelpers = reverseLinkedListAdapter.generateInputHelpers(reverseLinkedListTests);
    const invocation = reverseLinkedListAdapter.generateInvocation('solver');

    expect(serializer).toContain('serializeListNode');
    expect(inputHelpers).toContain('getTestHead');
    expect(inputHelpers).toContain('ListNode');
    expect(invocation).toContain('reverseList');
  });

  test('lru cache adapter includes time control helpers', () => {
    const serializer = lruCacheAdapter.generateSerializer();
    const inputHelpers = lruCacheAdapter.generateInputHelpers(lruCacheTests);
    const invocation = lruCacheAdapter.generateInvocation('cache');

    expect(serializer).toContain('serializeResult');
    expect(inputHelpers).toContain('Step');
    expect(inputHelpers).toContain('getTestSteps');
    expect(invocation).toContain('TestClock');
    expect(invocation).toContain('LRUCache');
  });

  test('paginated article stats adapter includes request helpers', () => {
    const serializer = paginatedArticleStatsAdapter.generateSerializer();
    const inputHelpers = paginatedArticleStatsAdapter.generateInputHelpers(paginatedArticleStatsTests);
    const invocation = paginatedArticleStatsAdapter.generateInvocation('solver');

    expect(serializer).toContain('serializeStatsObject');
    expect(inputHelpers).toContain('getApiPages');
    expect(inputHelpers).toContain('PaginatedArticleStats.Page');
    expect(invocation).toContain('ApiClient.setProvider');
    expect(invocation).toContain('analyzeArticles');
  });
});
