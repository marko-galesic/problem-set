import { createAdapter } from '../baseAdapter.js';
import {
  buildExpectedListCode,
  buildIntArrayInputHelper
} from '../helpers/javascript.js';

export default createAdapter({
  extractInput: (testCase) => ({
    nums: testCase.nums !== undefined ? testCase.nums : []
  }),
  buildExpectedCode: (expected, indent = '  ', varName = 'expected') => {
    return buildExpectedListCode(expected, indent, varName);
  },
  generateSerializer: () => {
    return `function compareThreeSumRows(a, b) {
  if (!Array.isArray(a) && !Array.isArray(b)) return 0;
  if (!Array.isArray(a)) return -1;
  if (!Array.isArray(b)) return 1;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return a.length - b.length;
}

function normalizeThreeSum(matrix) {
  if (!Array.isArray(matrix)) return null;
  const normalized = matrix.map((row) => {
    if (!Array.isArray(row)) return null;
    return [...row].sort((a, b) => a - b);
  });
  normalized.sort(compareThreeSumRows);
  return normalized;
}

function serializeThreeSum(matrix) {
  if (matrix === null || matrix === undefined) return "null";
  if (!Array.isArray(matrix)) return "null";
  if (matrix.length === 0) return "[]";
  const normalized = normalizeThreeSum(matrix);
  const parts = normalized.map((row) => {
    if (!Array.isArray(row)) return "null";
    return "[" + row.join(", ") + "]";
  });
  return "[" + parts.join(", ") + "]";
}`;
  },
  generateInvocation: (parserVar) => {
    return `const nums = getTestNums(i);
          actual = ${parserVar}.threeSum(nums);`;
  },
  generateInputHelpers: (testCases) => {
    return buildIntArrayInputHelper(testCases, 'nums', 'getTestNums');
  },
  getReturnType: () => 'number[][]',
  getSerializerMethod: () => 'serializeThreeSum',
  getDefaultClassName: () => 'ThreeSum'
});
