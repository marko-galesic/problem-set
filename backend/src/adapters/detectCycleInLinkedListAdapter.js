/**
 * Adapter for Detect Cycle in Linked List challenge
 * Handles detectCycleInLinkedList(ListNode head) method that returns boolean
 *
 * Note: ListNode.java is always provided as a top-level utility file.
 */

function buildExpectedBooleanCode(expected, indent = '        ', varName = 'expected') {
  if (expected === null || expected === undefined) {
    return `${indent}boolean ${varName} = false;\n`;
  }
  return `${indent}boolean ${varName} = ${expected};\n`;
}

export default {
  extractInput: (testCase) => {
    return {
      head: testCase.head !== undefined ? testCase.head : null,
      pos: testCase.pos !== undefined ? testCase.pos : -1
    };
  },

  buildExpectedCode: (expected, indent = '        ', varName = 'expected') => {
    return buildExpectedBooleanCode(expected, indent, varName);
  },

  generateSerializer: () => {
    return `    // Serialize a boolean to a canonical string representation
    private static String serializeBoolean(boolean value) {
        return String.valueOf(value);
    }`;
  },

  generateInvocation: (parserVar) => {
    return `                    ListNode head = getTestHead(i);
                    actual = ${parserVar}.detectCycleInLinkedList(head);`;
  },

  generateInputHelpers: (testCases) => {
    const buildListNodeCode = testCases.map((tc, idx) => {
      const head = tc.head !== undefined ? tc.head : null;
      const pos = tc.pos !== undefined ? tc.pos : -1;

      if (!head || head === null || (Array.isArray(head) && head.length === 0)) {
        return `        if (index == ${idx}) return null;`;
      }

      if (!Array.isArray(head)) {
        return `        if (index == ${idx}) return null;`;
      }

      if (head.length === 0) {
        return `        if (index == ${idx}) return null;`;
      }

      let code = `        if (index == ${idx}) {
`;
      const nodeVars = [];
      head.forEach((val, i) => {
        nodeVars.push(`node${idx}_${i}`);
        code += `            ListNode node${idx}_${i} = new ListNode(${val});\n`;
      });

      for (let i = 0; i < nodeVars.length - 1; i++) {
        code += `            ${nodeVars[i]}.next = ${nodeVars[i + 1]};\n`;
      }

      if (Number.isInteger(pos) && pos >= 0 && pos < nodeVars.length) {
        code += `            ${nodeVars[nodeVars.length - 1]}.next = ${nodeVars[pos]};\n`;
      }

      code += `            return ${nodeVars[0]};\n`;
      code += `        }`;

      return code;
    }).join('\n');

    return `    private static ListNode getTestHead(int index) {
${buildListNodeCode}
        return null;
    }`;
  },

  checkUserDefinedClasses: () => {
    return {};
  },

  generateHelperClasses: () => {
    return '';
  },

  getReturnType: () => 'boolean',
  getSerializerMethod: () => 'serializeBoolean',
  getDefaultClassName: () => 'DetectCycleInLinkedList',

  preprocessTestCases: (testCases) => testCases,
  transformUserCode: (userCode, testCases) => userCode
};
