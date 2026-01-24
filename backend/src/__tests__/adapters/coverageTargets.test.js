import { describe, expect, test } from '@jest/globals';
import paginatedArticleStatsAdapter from '../../adapters/paginatedArticleStatsAdapter.js';
import paginatedArticleStatsJsAdapter from '../../adapters/javascript/paginatedArticleStatsAdapter.js';
import topKFrequentElementsAdapter from '../../adapters/topKFrequentElementsAdapter.js';
import topKFrequentElementsJsAdapter from '../../adapters/javascript/topKFrequentElementsAdapter.js';
import topKFrequentElementsPyAdapter from '../../adapters/python/topKFrequentElementsAdapter.js';

const edgeCaseTestCases = [
  {
    apiPages: [
      null,
      { page: 'x', total_pages: undefined, data: null },
      {
        page: 1,
        total_pages: 2,
        data: [null, { id: 'bad', title: null, author: null, num_comments: NaN }]
      }
    ],
    author: null,
    title: 'Title'
  },
  {
    apiPages: 'not-an-array',
    pages: [],
    author: 'Author',
    title: null
  },
  {}
];

describe('adapter edge coverage', () => {
  test('paginated article stats adapters handle edge input', () => {
    const javaHelpers = paginatedArticleStatsAdapter.generateInputHelpers(edgeCaseTestCases);
    expect(javaHelpers).toContain('getApiPages');

    const jsHelpers = paginatedArticleStatsJsAdapter.generateInputHelpers(edgeCaseTestCases);
    expect(jsHelpers).toContain('getApiPages');

    expect(paginatedArticleStatsAdapter.extractInput({})).toEqual({ author: '', title: '' });
    expect(paginatedArticleStatsJsAdapter.extractInput({})).toEqual({ author: '', title: '' });

    const javaExpectedNull = paginatedArticleStatsAdapter.buildExpectedCode(null);
    expect(javaExpectedNull).toContain('= null');

    const jsExpectedNull = paginatedArticleStatsJsAdapter.buildExpectedCode(null);
    expect(jsExpectedNull).toContain('= null');

    const javaExpectedNonFinite = paginatedArticleStatsAdapter.buildExpectedCode({
      sumByAuthor: 'x',
      countTitleMatches: NaN
    });
    expect(javaExpectedNonFinite).toContain('sumByAuthor');

    const jsExpectedNonFinite = paginatedArticleStatsJsAdapter.buildExpectedCode({
      sumByAuthor: 'x',
      countTitleMatches: NaN
    });
    expect(jsExpectedNonFinite).toContain('sumByAuthor');
  });

  test('top k frequent adapters default missing fields', () => {
    const expected = { nums: [], k: 0 };

    expect(topKFrequentElementsAdapter.extractInput({})).toEqual(expected);
    expect(topKFrequentElementsJsAdapter.extractInput({})).toEqual(expected);
    expect(topKFrequentElementsPyAdapter.extractInput({})).toEqual(expected);
  });
});
