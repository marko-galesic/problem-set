import { serializeBoolean } from '../helpers/javascript.js';

function buildExpectedBooleanCode(expected, indent = '  ', varName = 'expected') {
  const value = expected ? 'true' : 'false';
  return `${indent}const ${varName} = ${value};\n`;
}

export default {
  extractInput: (testCase) => ({
    head: testCase.head !== undefined ? testCase.head : null,
    pos: testCase.pos !== undefined ? testCase.pos : -1
  }),
  buildExpectedCode: (expected, indent = '  ', varName = 'expected') => {
    return buildExpectedBooleanCode(expected, indent, varName);
  },
  generateSerializer: () => serializeBoolean(),
  generateInvocation: (parserVar) => {
    return `const head = getTestHead(i);
          actual = ${parserVar}.detectCycleInLinkedList(head);`;
  },
  generateInputHelpers: (testCases) => {
    const buildHeadCode = testCases.map((tc, idx) => {
      const head = tc.head !== undefined ? tc.head : null;
      const pos = tc.pos !== undefined ? tc.pos : -1;
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
      if (Number.isInteger(pos) && pos >= 0 && pos < nodeVars.length) {
        code += `    ${nodeVars[nodeVars.length - 1]}.next = ${nodeVars[pos]};\n`;
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
  getReturnType: () => 'boolean',
  getSerializerMethod: () => 'serializeBoolean',
  getDefaultClassName: () => 'DetectCycleInLinkedList'
};
