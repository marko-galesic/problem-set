import { pythonLiteral } from './utils.js';

export default {
  extractInput: (testCase) => {
    return {
      root: testCase.root !== undefined ? testCase.root : null,
      k: testCase.k !== undefined ? testCase.k : 0
    };
  },

  buildExpectedCode: (expected, indent = '    ', varName = 'expected') => {
    return `${indent}${varName} = ${pythonLiteral(expected)}\n`;
  },

  generateSerializer: () => {
    return `def serialize_int(value):
    return "null" if value is None else str(value)
`;
  },

  generateInvocation: (parserVar) => {
    return `root = get_test_root(i)
k = get_test_k(i)
actual = ${parserVar}.kthSmallestInBst(root, k)`;
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
    inputs = [[3, 1, 4, None, 2], [5, 3, 6, 2, 4, None, None, 1], [2, 1, 3], [10, 5, 15, 3, 7, 12, 18], [1]]
    values = inputs[index]
    return build_tree(values)

def get_test_k(index):
    inputs = [1, 3, 2, 5, 1]
    return inputs[index]

`;
  },

  checkUserDefinedClasses: () => ({}),
  generateHelperClasses: () => '',
  getReturnType: () => 'int',
  getSerializerMethod: () => 'serialize_int',
  getDefaultClassName: () => 'KthSmallestInBst',
  preprocessTestCases: (testCases) => testCases
};
