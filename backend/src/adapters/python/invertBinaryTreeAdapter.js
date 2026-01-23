import { pythonLiteral } from './utils.js';

export default {
  extractInput: (testCase) => {
    return {
      root: testCase.root !== undefined ? testCase.root : null
    };
  },

  buildExpectedCode: (expected, indent = '    ', varName = 'expected') => {
    if (!expected || !Array.isArray(expected) || expected.length === 0) {
      return `${indent}${varName} = None\n`;
    }
    return `${indent}${varName} = build_tree(${pythonLiteral(expected)})\n`;
  },

  generateSerializer: () => {
    return `def serialize_tree_node(root):
    if root is None:
        return "null"
    values = []
    queue = [root]
    while queue:
        node = queue.pop(0)
        if node is None:
            values.append("null")
        else:
            values.append(str(node.val))
            queue.append(node.left)
            queue.append(node.right)
    while values and values[-1] == "null":
        values.pop()
    return "[" + ", ".join(values) + "]"
`;
  },

  generateInvocation: (parserVar) => {
    return `root = get_test_root(i)
actual = ${parserVar}.invertTree(root)`;
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
  getReturnType: () => 'TreeNode',
  getSerializerMethod: () => 'serialize_tree_node',
  getDefaultClassName: () => 'InvertBinaryTree',
  preprocessTestCases: (testCases) => testCases
};
