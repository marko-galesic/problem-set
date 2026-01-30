import { pythonLiteral } from './utils.js';

export default {
  extractInput: (testCase) => {
    return {
      root: testCase.root !== undefined ? testCase.root : null
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
actual = ${parserVar}.diameterOfBinaryTree(root)`;
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
`;
  },

  checkUserDefinedClasses: () => ({}),
  generateHelperClasses: () => '',
  getReturnType: () => 'int',
  getSerializerMethod: () => 'serialize_int',
  getDefaultClassName: () => 'DiameterOfBinaryTree',
  preprocessTestCases: (testCases) => testCases
};
