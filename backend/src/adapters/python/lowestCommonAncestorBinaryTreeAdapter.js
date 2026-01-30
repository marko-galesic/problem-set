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
    const value = expected === undefined || expected === null ? 0 : expected;
    return `${indent}${varName} = ${value}\n`;
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
actual = ${parserVar}.lowestCommonAncestor(root, p, q)`;
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
    inputs = [
${testCases.map(tc => `        ${pythonLiteral(tc.root !== undefined ? tc.root : null)}`).join(',\n')}
    ]
    values = inputs[index]
    return build_tree(values)

def get_test_p(index):
    values = [
${testCases.map(tc => `        ${tc.p !== undefined ? tc.p : 0}`).join(',\n')}
    ]
    return values[index]

def get_test_q(index):
    values = [
${testCases.map(tc => `        ${tc.q !== undefined ? tc.q : 0}`).join(',\n')}
    ]
    return values[index]
`;
  },

  checkUserDefinedClasses: () => ({}),
  generateHelperClasses: () => '',
  getReturnType: () => 'int',
  getSerializerMethod: () => 'serialize_int',
  getDefaultClassName: () => 'LowestCommonAncestorBinaryTree',
  preprocessTestCases: (testCases) => testCases
};
