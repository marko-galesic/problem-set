import {
  serializeListNode
} from '../helpers/javascript.js';

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
    head: testCase.head !== undefined ? testCase.head : null
  }),
  buildExpectedCode: (expected, indent = '  ', varName = 'expected') => {
    return buildExpectedListNodeCode(expected, indent, varName);
  },
  generateSerializer: () => serializeListNode(),
  generateInvocation: (parserVar) => {
    return `const head = getTestHead(i);
          actual = ${parserVar}.reverseList(head);`;
  },
  generateInputHelpers: (testCases) => {
    const buildHeadCode = testCases.map((tc, idx) => {
      const head = tc.head !== undefined ? tc.head : null;
      if (!head || head === null || (Array.isArray(head) && head.length === 0)) {
        return `  if (index === ${idx}) return null;`;
      }
      if (!Array.isArray(head) || head.length === 0) {
        return `  if (index === ${idx}) return null;`;
      }
      let code = `  if (index === ${idx}) {\n`;
      const nodeVars = [];
      head.forEach((val, i) => {
        const nodeVar = `node${idx}_${i}`;
        nodeVars.push(nodeVar);
        code += `    const ${nodeVar} = new ListNode(${val});\n`;
      });
      for (let i = 0; i < nodeVars.length - 1; i++) {
        code += `    ${nodeVars[i]}.next = ${nodeVars[i + 1]};\n`;
      }
      code += `    return ${nodeVars[0]};\n`;
      code += `  }`;
      return code;
    }).join('\n');

    return `function getTestHead(index) {
${buildHeadCode}
  return null;
}`;
  },
  checkUserDefinedClasses: () => ({}),
  generateHelperClasses: () => '',
  getReturnType: () => 'ListNode',
  getSerializerMethod: () => 'serializeListNode',
  getDefaultClassName: () => 'ReverseLinkedList'
};
