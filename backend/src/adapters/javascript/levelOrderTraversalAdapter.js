import { serializeIntMatrix } from '../helpers/javascript.js';

export default {
  extractInput: (testCase) => ({
    root: testCase.root !== undefined ? testCase.root : null
  }),
  buildExpectedCode: (expected, indent = '  ', varName = 'expected') => {
    const value = expected === undefined ? null : expected;
    return `${indent}const ${varName} = ${JSON.stringify(value)};\n`;
  },
  generateSerializer: () => serializeIntMatrix(),
  generateInvocation: (parserVar) => `const root = getTestRoot(i);
          actual = ${parserVar}.levelOrderTraversal(root);`,
  generateInputHelpers: () => `function buildTreeFromArray(values) {
  if (!Array.isArray(values) || values.length === 0) return null;
  const rootVal = values[0];
  if (rootVal === null || rootVal === undefined) return null;
  const root = new TreeNode(rootVal);
  const queue = [root];
  let idx = 1;
  while (queue.length && idx < values.length) {
    const node = queue.shift();
    if (!node) continue;
    const leftVal = values[idx++];
    if (leftVal !== null && leftVal !== undefined) {
      node.left = new TreeNode(leftVal);
      queue.push(node.left);
    }
    if (idx >= values.length) break;
    const rightVal = values[idx++];
    if (rightVal !== null && rightVal !== undefined) {
      node.right = new TreeNode(rightVal);
      queue.push(node.right);
    }
  }
  return root;
}

function getTestRoot(index) {
  const roots = [[3, 9, 20, null, null, 15, 7], [], [1], [1, 2, 3, 4, 5, null, 7], [10, 5, 15, null, 7, 12, 18]];
  return buildTreeFromArray(roots[index]);
}

`,
  checkUserDefinedClasses: () => ({}),
  generateHelperClasses: () => '',
  getReturnType: () => 'number[][]',
  getSerializerMethod: () => 'serializeIntMatrix',
  getDefaultClassName: () => 'LevelOrderTraversal'
};
