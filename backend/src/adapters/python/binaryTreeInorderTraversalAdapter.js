import { pythonLiteral } from './utils.js';

export default {
  extractInput: (testCase) => {
    return {
      root: testCase.root !== undefined ? testCase.root : null
    };
  },

  buildExpectedCode: (expected, indent = '    ', varName = 'expected') => {
    if (!Array.isArray(expected)) {
      return `${indent}${varName} = None\n`;
    }
    return `${indent}${varName} = ${pythonLiteral(expected)}\n`;
  },

  generateSerializer: () => {
    return `def serialize_int_array(arr):
    if arr is None:
        return "null"
    return "[" + ", ".join(str(x) for x in arr) + "]"
`;
  },

  generateInvocation: (parserVar) => {
    return `root = get_test_root(i)
actual = ${parserVar}.inorderTraversal(root)`;
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
  getReturnType: () => 'list[int]',
  getSerializerMethod: () => 'serialize_int_array',
  getDefaultClassName: () => 'BinaryTreeInorderTraversal',
  preprocessTestCases: (testCases) => testCases
};
