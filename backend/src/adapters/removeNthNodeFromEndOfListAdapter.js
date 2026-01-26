/**
 * Adapter for Remove Nth Node From End of List challenge
 * Handles removeNthFromEnd(ListNode head, int n) method that returns ListNode
 *
 * Note: ListNode.java is always provided as a top-level utility file.
 */

// Convert array representation to ListNode building code
function buildListNodeFromArray(arr, indent = '        ', varName = 'head') {
  if (!arr || arr === null || (Array.isArray(arr) && arr.length === 0)) {
    return `${indent}ListNode ${varName} = null;\n`;
  }

  if (!Array.isArray(arr)) {
    return `${indent}ListNode ${varName} = null;\n`;
  }

  // Build ListNode chain from array
  let code = '';
  const nodes = [];

  // Create all nodes first
  arr.forEach((val, idx) => {
    const nodeVar = `${varName}_node${idx}`;
    nodes.push(nodeVar);
    code += `${indent}ListNode ${nodeVar} = new ListNode(${val});\n`;
  });

  // Link nodes together
  for (let i = 0; i < nodes.length - 1; i++) {
    code += `${indent}${nodes[i]}.next = ${nodes[i + 1]};\n`;
  }

  // Set head
  code += `${indent}ListNode ${varName} = ${nodes.length > 0 ? nodes[0] : 'null'};\n`;

  return code;
}

// Convert expected array to ListNode building code
function buildExpectedListNodeCode(expected, indent = '        ', varName = 'expected') {
  if (!expected || expected === null || (Array.isArray(expected) && expected.length === 0)) {
    return `${indent}ListNode ${varName} = null;\n`;
  }

  if (!Array.isArray(expected)) {
    return `${indent}ListNode ${varName} = null;\n`;
  }

  return buildListNodeFromArray(expected, indent, varName);
}

export default {
  // Extract input from test case
  extractInput: (testCase) => {
    return {
      head: testCase.head !== undefined ? testCase.head : null,
      n: testCase.n !== undefined ? testCase.n : 0
    };
  },

  // Build Java code that creates the expected result
  buildExpectedCode: (expected, indent = '        ', varName = 'expected') => {
    return buildExpectedListNodeCode(expected, indent, varName);
  },

  // Generate Java code to serialize result
  generateSerializer: () => {
    return `    // Serialize a ListNode to a canonical string representation (array format)
    private static String serializeListNode(ListNode head) {
        if (head == null) return "null";

        StringBuilder sb = new StringBuilder();
        sb.append("[");

        ListNode current = head;
        boolean first = true;
        while (current != null) {
            if (!first) {
                sb.append(", ");
            }
            first = false;
            sb.append(current.val);
            current = current.next;
        }

        sb.append("]");
        return sb.toString();
    }`;
  },

  // Generate Java code to invoke the user's method
  // This should generate the code inside the try block, after actual is declared
  generateInvocation: (parserVar) => {
    return `                    ListNode head = getTestHead(i);
                    int n = getTestN(i);
                    actual = ${parserVar}.removeNthFromEnd(head, n);`;
  },

  // Generate helper methods for test input
  generateInputHelpers: (testCases) => {
    // Build helper method that creates ListNode from array
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

      // Build ListNode chain
      let code = `        if (index == ${idx}) {\n`;
      const nodeVars = [];
      head.forEach((val, i) => {
        nodeVars.push(`node${idx}_${i}`);
        code += `            ListNode node${idx}_${i} = new ListNode(${val});\n`;
      });

      // Link nodes
      for (let i = 0; i < nodeVars.length - 1; i++) {
        code += `            ${nodeVars[i]}.next = ${nodeVars[i + 1]};\n`;
      }

      // Return head
      code += `            return ${nodeVars[0]};\n`;
      code += `        }`;

      return code;
    }).join('\n');

    const nValues = testCases.map((tc) => (
      Number.isInteger(tc.n) ? tc.n : 0
    ));

    return `    private static ListNode getTestHead(int index) {
${buildListNodeCode}
        return null;
    }

    private static int getTestN(int index) {
        int[] values = {
${nValues.map((value) => `            ${value}`).join(',\n')}
        };
        return values[index];
    }`;
  },

  // Check if user code defines required classes/types (not needed for this challenge)
  checkUserDefinedClasses: () => {
    return {};
  },

  // Generate required helper classes/types if not in user code (not needed for this challenge)
  generateHelperClasses: () => {
    return '';
  },

  // Get the return type name for this challenge
  getReturnType: () => 'ListNode',

  // Get the serializer method name
  getSerializerMethod: () => 'serializeListNode',

  // Get default class name for this challenge
  getDefaultClassName: () => 'RemoveNthNodeFromEndOfList',

  // Preprocess test cases (no preprocessing needed)
  preprocessTestCases: (testCases) => testCases,

  // Transform user code (no transformation needed)
  transformUserCode: (userCode) => userCode
};
