import { createAdapter } from '../baseAdapter.js';
import {
  buildExpectedListCode,
  buildStringArrayInputHelper
} from '../helpers/javascript.js';

export default createAdapter({
  extractInput: (testCase) => ({
    strs: testCase.strs !== undefined ? testCase.strs : []
  }),
  buildExpectedCode: (expected, indent = '  ', varName = 'expected') => {
    return buildExpectedListCode(expected, indent, varName);
  },
  generateSerializer: () => {
    return `function compareGroupAnagramValues(a, b) {
  if (a === null && b === null) return 0;
  if (a === null) return -1;
  if (b === null) return 1;
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function compareGroupAnagramRows(a, b) {
  if (!Array.isArray(a) && !Array.isArray(b)) return 0;
  if (!Array.isArray(a)) return -1;
  if (!Array.isArray(b)) return 1;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const cmp = compareGroupAnagramValues(a[i], b[i]);
    if (cmp !== 0) return cmp;
  }
  return a.length - b.length;
}

function normalizeGroupAnagrams(matrix) {
  if (!Array.isArray(matrix)) return null;
  const normalized = matrix.map((row) => {
    if (!Array.isArray(row)) return null;
    const items = row.map((value) => (value === null || value === undefined ? null : String(value)));
    items.sort(compareGroupAnagramValues);
    return items;
  });
  normalized.sort(compareGroupAnagramRows);
  return normalized;
}

function serializeGroupAnagrams(matrix) {
  if (matrix === null || matrix === undefined) return "null";
  if (!Array.isArray(matrix)) return "null";
  if (matrix.length === 0) return "[]";
  const normalized = normalizeGroupAnagrams(matrix);
  const rows = normalized.map((row) => {
    if (!Array.isArray(row)) return "null";
    const items = row.map((value) => {
      if (value === null) return "null";
      return JSON.stringify(String(value));
    });
    return "[" + items.join(", ") + "]";
  });
  return "[" + rows.join(", ") + "]";
}`;
  },
  generateInvocation: (parserVar) => {
    return `const strs = getTestStrs(i);
          actual = ${parserVar}.groupAnagrams(strs);`;
  },
  generateInputHelpers: (testCases) => {
    return buildStringArrayInputHelper(testCases, 'strs', 'getTestStrs');
  },
  getReturnType: () => 'string[][]',
  getSerializerMethod: () => 'serializeGroupAnagrams',
  getDefaultClassName: () => 'GroupAnagrams'
});
