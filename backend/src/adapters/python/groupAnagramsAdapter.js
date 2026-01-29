import { createAdapter } from '../baseAdapter.js';
import {
  buildExpectedListCode,
  buildStringArrayInputHelper
} from '../helpers/python.js';

export default createAdapter({
  extractInput: (testCase) => ({
    strs: testCase.strs !== undefined ? testCase.strs : []
  }),
  buildExpectedCode: (expected, indent = '    ', varName = 'expected') => {
    return buildExpectedListCode(expected, indent, varName);
  },
  generateSerializer: () => {
    return `def normalize_group_anagrams(matrix):
    if not isinstance(matrix, list):
        return None
    normalized = []
    for row in matrix:
        if not isinstance(row, list):
            normalized.append(None)
            continue
        items = [None if value is None else str(value) for value in row]
        items.sort(key=lambda value: (value is not None, value or ""))
        normalized.append(items)

    def group_key(group):
        if group is None:
            return (0, ())
        return (1, tuple((0, "") if value is None else (1, value) for value in group))

    normalized.sort(key=group_key)
    return normalized


def serialize_group_anagrams(matrix):
    if matrix is None:
        return "null"
    if not isinstance(matrix, list):
        return "null"
    if len(matrix) == 0:
        return "[]"

    import json
    normalized = normalize_group_anagrams(matrix)
    rows = []
    for row in normalized:
        if row is None:
            rows.append("null")
            continue
        items = []
        for value in row:
            if value is None:
                items.append("null")
            else:
                items.append(json.dumps(str(value)))
        rows.append("[" + ", ".join(items) + "]")
    return "[" + ", ".join(rows) + "]"
`;
  },
  generateInvocation: (parserVar) => {
    return `strs = get_test_strs(i)
actual = ${parserVar}.groupAnagrams(strs)`;
  },
  generateInputHelpers: (testCases) => {
    return buildStringArrayInputHelper(testCases, 'strs', 'get_test_strs');
  },
  getReturnType: () => 'list[list[str]]',
  getSerializerMethod: () => 'serialize_group_anagrams',
  getDefaultClassName: () => 'GroupAnagrams'
});
