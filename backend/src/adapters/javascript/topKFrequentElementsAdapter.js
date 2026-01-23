import { createAdapter } from '../baseAdapter.js';
import {
  buildExpectedListCode,
  buildIntArrayInputHelper,
  buildIntScalarInputHelper
} from '../helpers/javascript.js';

export default createAdapter({
  extractInput: (testCase) => ({
    nums: testCase.nums !== undefined ? testCase.nums : [],
    k: testCase.k !== undefined ? testCase.k : 0
  }),
  buildExpectedCode: (expected, indent = '  ', varName = 'expected') => {
    return buildExpectedListCode(expected, indent, varName);
  },
  generateSerializer: () => {
    return `let currentFreqMap = null;

function setCurrentFreqMap(nums) {
  currentFreqMap = new Map();
  if (!Array.isArray(nums)) return;
  for (const n of nums) {
    currentFreqMap.set(n, (currentFreqMap.get(n) || 0) + 1);
  }
}

function serializeIntArray(arr) {
  if (arr === null || arr === undefined) return "null";
  if (arr.length === 0) return "[]";
  const sorted = [...arr].sort((a, b) => {
    const fa = currentFreqMap ? (currentFreqMap.get(a) || 0) : 0;
    const fb = currentFreqMap ? (currentFreqMap.get(b) || 0) : 0;
    if (fa !== fb) return fb - fa;
    return a - b;
  });
  return "[" + sorted.join(", ") + "]";
}`;
  },
  generateInvocation: (parserVar) => {
    return `const nums = getTestNums(i);
          const k = getTestK(i);
          setCurrentFreqMap(nums);
          actual = ${parserVar}.topKFrequent(nums, k);`;
  },
  generateInputHelpers: (testCases) => {
    return [
      buildIntArrayInputHelper(testCases, 'nums', 'getTestNums'),
      buildIntScalarInputHelper(testCases, 'k', 'getTestK')
    ].join('\n\n');
  },
  getReturnType: () => 'number[]',
  getSerializerMethod: () => 'serializeIntArray',
  getDefaultClassName: () => 'TopKFrequentElements'
});
