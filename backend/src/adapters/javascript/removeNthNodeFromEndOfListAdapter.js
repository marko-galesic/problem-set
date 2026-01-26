import { serializeListNode } from '../helpers/javascript.js';

function buildListNodeFromArray(arr, indent = '  ', varName = 'head') {
  if (!arr || arr === null || (Array.isArray(arr) && arr.length === 0)) {
    return `${indent}let ${varName} = null;\n`;
  }
  if (!Array.isArray(arr)) {
    return `${indent}let ${varName} = null;\n`;
  }
  let code = '';
  const nodes = [];
  arr.forEach((val, idx) => {
    const nodeVar = `${varName}_node${idx}`;
    nodes.push(nodeVar);
    code += `${indent}const ${nodeVar} = new ListNode(${val});\n`;
  });
  for (let i = 0; i < nodes.length - 1; i++) {
    code += `${indent}${nodes[i]}.next = ${nodes[i + 1]};\n`;
  }
  code += `${indent}let ${varName} = ${nodes.length > 0 ? nodes[0] : 'null'};\n`;
  return code;
}

function buildExpectedListNodeCode(expected, indent = '  ', varName = 'expected') {
  if (!expected || expected === null || (Array.isArray(expected) && expected.length === 0)) {
    return `${indent}let ${varName} = null;\n`;
  }
  if (!Array.isArray(expected)) {
    return `${indent}let ${varName} = null;\n`;
  }
  return buildListNodeFromArray(expected, indent, varName);
}

export default {
  extractInput: (testCase) => ({
    head: testCase.head !== undefined ? testCase.head : null,
    n: testCase.n !== undefined ? testCase.n : 0
  }),
  buildExpectedCode: (expected, indent = '  ', varName = 'expected') => {
    return buildExpectedListNodeCode(expected, indent, varName);
  },
  generateSerializer: () => serializeListNode(),
  generateInvocation: (parserVar) => {
    return `const { head, n } = getTestInput(i);
          actual = ${parserVar}.removeNthFromEnd(head, n);`;
  },
  generateInputHelpers: (testCases) => {
    return `function buildList(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return null;
  }
  const dummy = new ListNode(0);
  let current = dummy;
  for (const value of values) {
    current.next = new ListNode(value);
    current = current.next;
  }
  return dummy.next;
}

function getTestInput(index) {
  const inputs = [
${testCases.map(tc => `    { head: ${JSON.stringify(tc.head ?? null)}, n: ${tc.n ?? 0} }`).join(',\n')}
  ];
  const { head, n } = inputs[index];
  return { head: buildList(head), n };
}`;
  },
  checkUserDefinedClasses: () => ({}),
  generateHelperClasses: () => '',
  getReturnType: () => 'ListNode',
  getSerializerMethod: () => 'serializeListNode',
  getDefaultClassName: () => 'RemoveNthNodeFromEndOfList'
};
