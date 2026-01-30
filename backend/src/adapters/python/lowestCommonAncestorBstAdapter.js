import { pythonLiteral } from './utils.js';

export default {
  extractInput: (testCase) => {
    return {
      root: testCase.root !== undefined ? testCase.root : null,
      p: testCase.p !== undefined ? testCase.p : 0,
      q: testCase.q !== undefined ? testCase.q : 0
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
p = get_test_p(i)
q = get_test_q(i)
actual = ${parserVar}.lowestCommonAncestorBst(root, p, q)`;
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
    inputs = [[6, 2, 8, 0, 4, 7, 9, None, None, 3, 5], [6, 2, 8, 0, 4, 7, 9, None, None, 3, 5], [5, 3, 8, 2, 4, 6, 10], [2, 1, 3], [10, 5, 15, 3, 7, 12, 18]]
    values = inputs[index]
    return build_tree(values)

def get_test_p(index):
    inputs = [2, 2, 6, 1, 3]
    return inputs[index]

def get_test_q(index):
    inputs = [8, 4, 10, 3, 7]
    return inputs[index]

`;
  },

  checkUserDefinedClasses: () => ({}),
  generateHelperClasses: () => '',
  getReturnType: () => 'int',
  getSerializerMethod: () => 'serialize_int',
  getDefaultClassName: () => 'LowestCommonAncestorBst',
  preprocessTestCases: (testCases) => testCases
};
