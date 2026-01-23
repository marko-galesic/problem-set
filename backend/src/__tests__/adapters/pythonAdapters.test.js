import { beforeAll, describe, expect, test } from '@jest/globals';
import { readdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { createStandardAdapter } from '../../adapters/standardAdapterFactory.js';
import { standardAdapterDefinitions } from '../../adapters/standardAdapterDefinitions.js';
import {
  buildExpectedBooleanCode,
  buildExpectedDoubleCode,
  buildExpectedIntCode,
  buildExpectedListCode,
  buildExpectedStringCode,
  buildGridInputHelper,
  buildIntScalarInputHelper,
  buildListInputHelper,
  buildStringInputHelper,
  serializeBoolean,
  serializeDouble,
  serializeInt,
  serializeIntArray,
  serializeString
} from '../../adapters/helpers/python.js';
import invertBinaryTreeAdapter from '../../adapters/python/invertBinaryTreeAdapter.js';
import lruCacheAdapter from '../../adapters/python/lruCacheAdapter.js';
import paginatedArticleStatsAdapter from '../../adapters/python/paginatedArticleStatsAdapter.js';
import reverseLinkedListAdapter from '../../adapters/python/reverseLinkedListAdapter.js';
import { runTests as invertBinaryTreeTests } from '../../testCases/invertBinaryTreeTests.js';
import { runTests as lruCacheTests } from '../../testCases/lrucachewithttl.js';
import { runTests as paginatedArticleStatsTests } from '../../testCases/paginatedArticleStatsTests.js';
import { runTests as reverseLinkedListTests } from '../../testCases/reverseLinkedListTests.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const adaptersDir = join(__dirname, '../../adapters/python');
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
        adapter = createStandardAdapter(standardAdapterDefinitions[adapterBase], 'python');
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

describe('python adapter helpers', () => {
  test('buildExpected helpers emit python literals', () => {
    const intCode = buildExpectedIntCode(7);
    const doubleCode = buildExpectedDoubleCode(2.5);
    const boolCode = buildExpectedBooleanCode(false);
    const stringCode = buildExpectedStringCode('a"b');
    const listCode = buildExpectedListCode([1, 2]);

    expect(intCode).toContain('expected = 7');
    expect(doubleCode).toContain('expected = 2.5');
    expect(boolCode).toContain('expected = False');
    expect(stringCode).toContain('expected = "a\\"b"');
    expect(listCode).toContain('expected = [1, 2]');
  });

  test('serializer helpers emit expected function shells', () => {
    const intSerializer = serializeInt();
    const doubleSerializer = serializeDouble();
    const booleanSerializer = serializeBoolean();
    const stringSerializer = serializeString();
    const intArraySerializer = serializeIntArray();

    expect(intSerializer).toContain('def serialize_int');
    expect(doubleSerializer).toContain('def serialize_double');
    expect(doubleSerializer).toContain(':.5f');
    expect(booleanSerializer).toContain('def serialize_boolean');
    expect(stringSerializer).toContain('def serialize_string');
    expect(stringSerializer).toContain('replace');
    expect(intArraySerializer).toContain('def serialize_int_array');
  });

  test('input helpers emit test input builders', () => {
    const testCases = [
      { nums: [1, 2], target: 3, s: 'a"b', grid: [[1, 0], [0, 1]] },
      { nums: [], target: 0, s: 'x', grid: [] }
    ];

    const listHelper = buildListInputHelper(testCases, 'nums', 'get_nums');
    const intHelper = buildIntScalarInputHelper(testCases, 'target', 'get_target');
    const stringHelper = buildStringInputHelper(testCases, 's', 'get_string');
    const gridHelper = buildGridInputHelper(testCases, 'grid', 'get_grid');

    expect(listHelper).toContain('def get_nums');
    expect(listHelper).toContain('[1, 2]');
    expect(intHelper).toContain('def get_target');
    expect(intHelper).toContain('3');
    expect(stringHelper).toContain('def get_string');
    expect(stringHelper).toContain('a\\"b');
    expect(gridHelper).toContain('def get_grid');
    expect(gridHelper).toContain('return [row[:] for row in grid]');
  });
});

describe('python adapters', () => {
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
      expect(serializer).toContain('def');

      const invocation = adapter.generateInvocation('solver');
      expect(typeof invocation).toBe('string');
      expect(invocation).toMatch(/\bactual\b/);

      const inputHelpers = adapter.generateInputHelpers(runTests);
      expect(typeof inputHelpers).toBe('string');
      expect(inputHelpers).toContain('def');

      const returnType = adapter.getReturnType();
      expect(typeof returnType).toBe('string');
      expect(returnType.length).toBeGreaterThan(0);

      const serializerMethod = adapter.getSerializerMethod();
      expect(typeof serializerMethod).toBe('string');
      expect(serializerMethod.length).toBeGreaterThan(0);

      expect(typeof adapter.getDefaultClassName).toBe('function');
      const defaultClassName = adapter.getDefaultClassName();
      expect(typeof defaultClassName).toBe('string');
      expect(defaultClassName.length).toBeGreaterThan(0);

      expect(file).toBeTruthy();
      expect(testCaseFile).toBeTruthy();
    }
  });
});

describe('python adapters (special cases)', () => {
  test('tree adapters emit tree helpers and serializer', () => {
    const serializer = invertBinaryTreeAdapter.generateSerializer();
    const inputHelpers = invertBinaryTreeAdapter.generateInputHelpers(invertBinaryTreeTests);
    const invocation = invertBinaryTreeAdapter.generateInvocation('solver');

    expect(serializer).toContain('serialize_tree_node');
    expect(inputHelpers).toContain('def build_tree');
    expect(inputHelpers).toContain('TreeNode');
    expect(invocation).toContain('invertTree');
  });

  test('list adapters emit list helpers and serializer', () => {
    const serializer = reverseLinkedListAdapter.generateSerializer();
    const inputHelpers = reverseLinkedListAdapter.generateInputHelpers(reverseLinkedListTests);
    const invocation = reverseLinkedListAdapter.generateInvocation('solver');

    expect(serializer).toContain('serialize_list_node');
    expect(inputHelpers).toContain('def build_list');
    expect(inputHelpers).toContain('ListNode');
    expect(invocation).toContain('reverseList');
  });

  test('lru cache adapter includes time control helpers', () => {
    const serializer = lruCacheAdapter.generateSerializer();
    const inputHelpers = lruCacheAdapter.generateInputHelpers(lruCacheTests);
    const invocation = lruCacheAdapter.generateInvocation('solver');

    expect(serializer).toContain('serialize_result');
    expect(inputHelpers).toContain('class Step');
    expect(inputHelpers).toContain('get_test_steps');
    expect(invocation).toContain('TestClock');
    expect(invocation).toContain('LRUCache');

    const processed = lruCacheAdapter.preprocessTestCases([
      { steps: [{ op: 'get', args: [1], expected: 2 }] }
    ]);
    expect(processed[0].expected).toBe(2);

    const emptyProcessed = lruCacheAdapter.preprocessTestCases([{ id: 1 }]);
    expect(emptyProcessed[0].expected).toBe(-1);

    const noGetProcessed = lruCacheAdapter.preprocessTestCases([
      { steps: [{ op: 'put', args: [1, 1] }] }
    ]);
    expect(noGetProcessed[0].expected).toBe(-1);

    const noTime = lruCacheAdapter.transformUserCode('now = time.time()', [
      { steps: [{ op: 'put', args: [1, 1] }] }
    ]);
    expect(noTime).toBe('now = time.time()');

    const withTime = lruCacheAdapter.transformUserCode('now = time.time()', [
      { steps: [{ op: 'put', args: [1, 1], at: 5 }] }
    ]);
    expect(withTime).toContain('TestClock.current_time_millis()');

    expect(lruCacheAdapter.checkUserDefinedClasses('class LRUCache:\n    pass').hasLRUCache).toBe(true);
    expect(lruCacheAdapter.checkUserDefinedClasses('class Other:\n    pass').hasLRUCache).toBe(false);
    expect(lruCacheAdapter.checkUserDefinedClasses(null).hasLRUCache).toBe(false);
    expect(lruCacheAdapter.generateHelperClasses()).toBe('');

    const emptyStepsHelpers = lruCacheAdapter.generateInputHelpers([{ steps: [] }]);
    expect(emptyStepsHelpers).toContain('[]');

    const unknownOpHelpers = lruCacheAdapter.generateInputHelpers([
      { steps: [{ op: 'noop', args: [] }] }
    ]);
    expect(unknownOpHelpers).toContain('[]');
  });

  test('paginated article stats adapter includes request mocks', () => {
    const serializer = paginatedArticleStatsAdapter.generateSerializer();
    const inputHelpers = paginatedArticleStatsAdapter.generateInputHelpers(paginatedArticleStatsTests);
    const invocation = paginatedArticleStatsAdapter.generateInvocation('solver');

    expect(serializer).toContain('serialize_stats_object');
    expect(serializer).toContain('sumByAuthor');
    expect(inputHelpers).toContain('API_BASE_URL');
    expect(inputHelpers).toContain('requests.get');
    expect(invocation).toContain('setup_requests_mock');
    expect(invocation).toContain('analyzeArticles');
  });

  test('paginated article stats adapter serializes mixed literals', () => {
    const testCases = [
      {
        apiPages: [
          {
            page: 1,
            total_pages: 1,
            data: [
              {
                id: 1,
                title: 'Hello\nWorld',
                author: 'Alice',
                num_comments: Infinity,
                featured: true,
                meta: { ok: false },
                tags: ['x']
              }
            ]
          },
          null
        ],
        author: null,
        title: 'Hello\nWorld'
      }
    ];

    const helpers = paginatedArticleStatsAdapter.generateInputHelpers(testCases);
    expect(helpers).toContain('None');
    expect(helpers).toContain('True');
    expect(helpers).toContain('False');
    expect(helpers).toContain('Hello\\nWorld');
  });
});
