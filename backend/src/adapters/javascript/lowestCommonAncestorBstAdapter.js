import { serializeInt } from '../helpers/javascript.js';

export default {
  extractInput: (testCase) => ({
    root: testCase.root !== undefined ? testCase.root : null,
    p: testCase.p !== undefined ? testCase.p : 0,
    q: testCase.q !== undefined ? testCase.q : 0
  }),
  buildExpectedCode: (expected, indent = '  ', varName = 'expected') => {
    const value = expected === undefined ? null : expected;
    return `${indent}const ${varName} = ${JSON.stringify(value)};\n`;
  },
  generateSerializer: () => serializeInt(),
  generateInvocation: (parserVar) => `const root = getTestRoot(i);
          const p = getTestP(i);
          const q = getTestQ(i);
          actual = ${parserVar}.lowestCommonAncestorBst(root, p, q);`,
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
  const roots = [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], [5, 3, 8, 2, 4, 6, 10], [2, 1, 3], [10, 5, 15, 3, 7, 12, 18]];
  return buildTreeFromArray(roots[index]);
}

function getTestP(index) {
  const values = [2, 2, 6, 1, 3];
  return values[index];
}

function getTestQ(index) {
  const values = [8, 4, 10, 3, 7];
  return values[index];
}
`,
  checkUserDefinedClasses: () => ({}),
  generateHelperClasses: () => '',
  getReturnType: () => 'number',
  getSerializerMethod: () => 'serializeInt',
  getDefaultClassName: () => 'LowestCommonAncestorBst'
};
