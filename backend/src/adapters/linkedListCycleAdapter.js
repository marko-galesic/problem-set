/**
 * Adapter for Linked List Cycle challenge
 * Handles hasCycle(ListNode head) method that returns boolean
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
    // Linked List Cycle test cases use 'head' and 'pos' fields
    return {
      head: testCase.head !== undefined ? testCase.head : null,
      pos: testCase.pos !== undefined ? testCase.pos : -1
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
  // This should generate the code inside the try block, after actual is declared
  generateInvocation: (parserVar) => {
    return `                    ListNode head = getTestHead(i);
                    actual = ${parserVar}.hasCycle(head);`;
  },

  // Generate helper methods for test input
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

      let code = `        if (index == ${idx}) {\n`;
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

  // Check if user code defines required classes/types (not needed for Linked List Cycle)
  checkUserDefinedClasses: (userCode) => {
    return {};
  },

  // Generate required helper classes/types if not in user code (not needed for Linked List Cycle)
  generateHelperClasses: () => {
    return '';
  },

  // Get the return type name for this challenge
  getReturnType: () => 'boolean',

  // Get the serializer method name
  getSerializerMethod: () => 'serializeBoolean',

  // Get default class name for this challenge
  getDefaultClassName: () => 'LinkedListCycle',

  // Preprocess test cases (no preprocessing needed for Linked List Cycle)
  preprocessTestCases: (testCases) => testCases,

  // Transform user code (no transformation needed for Linked List Cycle)
  transformUserCode: (userCode, testCases) => userCode
};
