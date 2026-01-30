import { buildExpectedIntCode, serializeInt } from '../helpers/javascript.js';

function buildTreeFromArrayCode(arr, indent = '  ', varName = 'root') {
  if (!arr || arr === null || (Array.isArray(arr) && arr.length === 0)) {
    return `${indent}let ${varName} = null;\n`;
  }
  if (!Array.isArray(arr)) {
    return `${indent}let ${varName} = null;\n`;
  }
  return `${indent}let ${varName} = buildTreeFromArray(${JSON.stringify(arr)});\n`;
}

export default {
  extractInput: (testCase) => ({
    root: testCase.root !== undefined ? testCase.root : null,
    p: testCase.p !== undefined ? testCase.p : 0,
    q: testCase.q !== undefined ? testCase.q : 0
  }),
  buildExpectedCode: (expected, indent = '  ', varName = 'expected') => {
    return buildExpectedIntCode(expected, indent, varName);
  },
  generateSerializer: () => serializeInt(),
  generateInvocation: (parserVar) => {
    return `const root = getTestRoot(i);
          const p = getTestP(i);
          const q = getTestQ(i);
          actual = ${parserVar}.lowestCommonAncestor(root, p, q);`;
  },
  generateInputHelpers: (testCases) => {
    const roots = testCases.map(tc => tc.root !== undefined ? tc.root : null);
    const ps = testCases.map(tc => tc.p !== undefined ? tc.p : 0);
    const qs = testCases.map(tc => tc.q !== undefined ? tc.q : 0);
    return `function buildTreeFromArray(values) {
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
  const roots = ${JSON.stringify(roots)};
  return buildTreeFromArray(roots[index]);
}

function getTestP(index) {
  const values = ${JSON.stringify(ps)};
  return values[index];
}

function getTestQ(index) {
  const values = ${JSON.stringify(qs)};
  return values[index];
}`;
  },
  checkUserDefinedClasses: () => ({}),
  generateHelperClasses: () => '',
  getReturnType: () => 'number',
  getSerializerMethod: () => 'serializeInt',
  getDefaultClassName: () => 'LowestCommonAncestorBinaryTree'
};
