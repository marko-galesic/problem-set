import { pythonLiteral } from './utils.js';

export default {
  extractInput: (testCase) => {
    return {
      root: testCase.root !== undefined ? testCase.root : null
    };
  },

  buildExpectedCode: (expected, indent = '    ', varName = 'expected') => {
    return `${indent}${varName} = ${pythonLiteral(expected)}\n`;
  },

  generateSerializer: () => {
    return `def serialize_int_matrix(matrix):
    if matrix is None:
        return "null"
    if not isinstance(matrix, list):
        return "null"
    if len(matrix) == 0:
        return "[]"
    parts = []
    for row in matrix:
        if row is None:
            parts.append("null")
        else:
            parts.append("[" + ", ".join(str(x) for x in row) + "]")
    return "[" + ", ".join(parts) + "]"
`;
  },

  generateInvocation: (parserVar) => {
    return `root = get_test_root(i)
actual = ${parserVar}.levelOrderTraversal(root)`;
  },

  generateInputHelpers: (testCases) => {
    return `def build_tree(values):
    if values is None or len(values) == 0:
        return None
    nodes = [TreeNode(v) if v is not None else None for v in values]
    kid_index = 1
    for idx in range(len(nodes)):
        node = nodes[idx]
        if node is None:
            continue
        if kid_index < len(nodes):
            node.left = nodes[kid_index]
            kid_index += 1
        if kid_index < len(nodes):
            node.right = nodes[kid_index]
            kid_index += 1
    return nodes[0]

def get_test_root(index):
    inputs = [[3, 9, 20, None, None, 15, 7], [], [1], [1, 2, 3, 4, 5, None, 7], [10, 5, 15, None, 7, 12, 18]]
    values = inputs[index]
    return build_tree(values)

`;
  },

  checkUserDefinedClasses: () => ({}),
  generateHelperClasses: () => '',
  getReturnType: () => 'list[list[int]]',
  getSerializerMethod: () => 'serialize_int_matrix',
  getDefaultClassName: () => 'LevelOrderTraversal',
  preprocessTestCases: (testCases) => testCases
};
