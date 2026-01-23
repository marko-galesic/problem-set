import { serializeListNode } from '../helpers/javascript.js';

function buildExpectedListNodeCode(expected, indent = '  ', varName = 'expected') {
  if (!expected || expected === null || (Array.isArray(expected) && expected.length === 0)) {
    return `${indent}let ${varName} = null;\n`;
  }
  if (!Array.isArray(expected)) {
    return `${indent}let ${varName} = null;\n`;
  }
  let code = '';
  const nodes = [];
  expected.forEach((val, idx) => {
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

export default {
  extractInput: (testCase) => ({
    list1: testCase.list1 !== undefined ? testCase.list1 : null,
    list2: testCase.list2 !== undefined ? testCase.list2 : null
  }),
  buildExpectedCode: (expected, indent = '  ', varName = 'expected') => {
    return buildExpectedListNodeCode(expected, indent, varName);
  },
  generateSerializer: () => serializeListNode(),
  generateInvocation: (parserVar) => {
    return `const list1 = getTestList1(i);
          const list2 = getTestList2(i);
          actual = ${parserVar}.mergeTwoLists(list1, list2);`;
  },
  generateInputHelpers: (testCases) => {
    const buildListCode = (field, fnName) => {
      const cases = testCases.map((tc, idx) => {
        const list = tc[field] !== undefined ? tc[field] : null;
        if (!list || list === null || (Array.isArray(list) && list.length === 0)) {
          return `  if (index === ${idx}) return null;`;
        }
        if (!Array.isArray(list) || list.length === 0) {
          return `  if (index === ${idx}) return null;`;
        }
        let code = `  if (index === ${idx}) {\n`;
        const nodeVars = [];
        list.forEach((val, i) => {
          const nodeVar = `node${idx}_${i}_${field}`;
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
      return `function ${fnName}(index) {
${cases}
  return null;
}`;
    };

    return [
      buildListCode('list1', 'getTestList1'),
      buildListCode('list2', 'getTestList2')
    ].join('\n\n');
  },
  checkUserDefinedClasses: () => ({}),
  generateHelperClasses: () => '',
  getReturnType: () => 'ListNode',
  getSerializerMethod: () => 'serializeListNode',
  getDefaultClassName: () => 'MergeTwoSortedLists'
};
