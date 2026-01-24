import { createAdapter } from '../baseAdapter.js';
import {
  buildExpectedListCode,
  buildListInputHelper
} from '../helpers/python.js';

export default createAdapter({
  extractInput: (testCase) => ({
    nums: testCase.nums !== undefined ? testCase.nums : []
  }),
  buildExpectedCode: (expected, indent = '    ', varName = 'expected') => {
    return buildExpectedListCode(expected, indent, varName);
  },
  generateSerializer: () => {
    return `def serialize_three_sum(matrix):
    if matrix is None:
        return "null"
    if not isinstance(matrix, list):
        return "null"
    if len(matrix) == 0:
        return "[]"

    normalized = []
    for row in matrix:
        if not isinstance(row, (list, tuple)):
            normalized.append(None)
        else:
            normalized.append(sorted(row))

    def row_key(row):
        if row is None:
            return (0,)
        return (1, tuple(row))

    normalized.sort(key=row_key)

    parts = []
    for row in normalized:
        if row is None:
            parts.append("null")
        else:
            parts.append("[" + ", ".join(str(x) for x in row) + "]")

    return "[" + ", ".join(parts) + "]"
`;
  },
  generateInvocation: (parserVar) => {
    return `nums = get_test_nums(i)
actual = ${parserVar}.threeSum(nums)`;
  },
  generateInputHelpers: (testCases) => {
    return buildListInputHelper(testCases, 'nums', 'get_test_nums');
  },
  getReturnType: () => 'list[list[int]]',
  getSerializerMethod: () => 'serialize_three_sum',
  getDefaultClassName: () => 'ThreeSum'
});
