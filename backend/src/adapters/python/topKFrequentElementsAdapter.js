import { createAdapter } from '../baseAdapter.js';
import {
  buildExpectedListCode,
  buildIntScalarInputHelper,
  buildListInputHelper
} from '../helpers/python.js';

export default createAdapter({
  extractInput: (testCase) => {
    return {
      nums: testCase.nums !== undefined ? testCase.nums : [],
      k: testCase.k !== undefined ? testCase.k : 0
    };
  },
  buildExpectedCode: (expected, indent = '    ', varName = 'expected') => {
    return buildExpectedListCode(expected, indent, varName);
  },
  generateSerializer: () => {
    return `current_freq_map = None

def set_current_freq_map(nums):
    global current_freq_map
    current_freq_map = {}
    if nums is None:
        return
    for n in nums:
        current_freq_map[n] = current_freq_map.get(n, 0) + 1

def serialize_int_array(arr):
    if arr is None:
        return "null"
    if current_freq_map is None:
        values = arr
    else:
        values = sorted(arr, key=lambda x: (-current_freq_map.get(x, 0), x))
    return "[" + ", ".join(str(x) for x in values) + "]"
`;
  },
  generateInvocation: (parserVar) => {
    return `nums = get_test_nums(i)
k = get_test_k(i)
set_current_freq_map(nums)
actual = ${parserVar}.topKFrequent(nums, k)`;
  },
  generateInputHelpers: (testCases) => {
    return [
      buildListInputHelper(testCases, 'nums', 'get_test_nums'),
      buildIntScalarInputHelper(testCases, 'k', 'get_test_k')
    ].join('\n');
  },
  getReturnType: () => 'list[int]',
  getSerializerMethod: () => 'serialize_int_array',
  getDefaultClassName: () => 'TopKFrequentElements'
});
