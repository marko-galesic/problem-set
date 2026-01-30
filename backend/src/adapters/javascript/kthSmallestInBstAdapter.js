import { serializeInt } from '../helpers/javascript.js';

export default {
  extractInput: (testCase) => ({
    root: testCase.root !== undefined ? testCase.root : null,
    k: testCase.k !== undefined ? testCase.k : 0
  }),
  buildExpectedCode: (expected, indent = '  ', varName = 'expected') => {
    const value = expected === undefined ? null : expected;
    return `${indent}const ${varName} = ${JSON.stringify(value)};\n`;
  },
  generateSerializer: () => serializeInt(),
  generateInvocation: (parserVar) => `const root = getTestRoot(i);
          const k = getTestK(i);
          actual = ${parserVar}.kthSmallestInBst(root, k);`,
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
  const roots = [[3, 1, 4, null, 2], [5, 3, 6, 2, 4, null, null, 1], [2, 1, 3], [10, 5, 15, 3, 7, 12, 18], [1]];
  return buildTreeFromArray(roots[index]);
}

function getTestK(index) {
  const values = [1, 3, 2, 5, 1];
  return values[index];
}
`,
  checkUserDefinedClasses: () => ({}),
  generateHelperClasses: () => '',
  getReturnType: () => 'number',
  getSerializerMethod: () => 'serializeInt',
  getDefaultClassName: () => 'KthSmallestInBst'
};
