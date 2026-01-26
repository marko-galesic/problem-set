/**
 * Adapter for Palindrome Linked List challenge
 * Handles isPalindrome(ListNode head) method that returns boolean
 *
 * Note: ListNode.java is always provided as a top-level utility file.
 */

// Convert expected boolean to Java code
function buildExpectedBooleanCode(expected, indent = '        ', varName = 'expected') {
  if (expected === null || expected === undefined) {
    return `${indent}boolean ${varName} = false;\n`;
  }
  return `${indent}boolean ${varName} = ${expected};\n`;
}

export default {
  // Extract input from test case
  extractInput: (testCase) => {
    return {
      head: testCase.head !== undefined ? testCase.head : null
    };
  },

  // Build Java code that creates the expected result
  buildExpectedCode: (expected, indent = '        ', varName = 'expected') => {
    return buildExpectedBooleanCode(expected, indent, varName);
  },

  // Generate Java code to serialize result
  generateSerializer: () => {
    return `    // Serialize a boolean to a canonical string representation
    private static String serializeBoolean(boolean value) {
        return String.valueOf(value);
    }`;
  },

  // Generate Java code to invoke the user's method
  generateInvocation: (parserVar) => {
    return `                    ListNode head = getTestHead(i);
                    actual = ${parserVar}.isPalindrome(head);`;
  },

  // Generate helper methods for test input
  generateInputHelpers: (testCases) => {
    const buildListNodeCode = testCases.map((tc, idx) => {
      const head = tc.head !== undefined ? tc.head : null;

      if (!head || head === null || (Array.isArray(head) && head.length === 0)) {
        return `        if (index == ${idx}) return null;`;
      }

      if (!Array.isArray(head)) {
        return `        if (index == ${idx}) return null;`;
      }

      if (head.length === 0) {
        return `        if (index == ${idx}) return null;`;
      }

      let code = `        if (index == ${idx}) {\n`;
      const nodeVars = [];
      head.forEach((val, i) => {
        nodeVars.push(`node${idx}_${i}`);
        code += `            ListNode node${idx}_${i} = new ListNode(${val});\n`;
      });

      for (let i = 0; i < nodeVars.length - 1; i++) {
        code += `            ${nodeVars[i]}.next = ${nodeVars[i + 1]};\n`;
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

  checkUserDefinedClasses: (userCode) => {
    return {};
  },

  generateHelperClasses: () => {
    return '';
  },

  getReturnType: () => 'boolean',

  getSerializerMethod: () => 'serializeBoolean',

  getDefaultClassName: () => 'PalindromeLinkedList',

  preprocessTestCases: (testCases) => testCases,

  transformUserCode: (userCode, testCases) => userCode
};
