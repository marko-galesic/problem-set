/**
 * Adapter for Merge Two Sorted Lists challenge
 * Handles mergeTwoLists(ListNode list1, ListNode list2) method that returns ListNode
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
    // Merge Two Sorted Lists test cases use 'list1' and 'list2' fields (array representation)
    return {
      list1: testCase.list1 !== undefined ? testCase.list1 : null,
      list2: testCase.list2 !== undefined ? testCase.list2 : null
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
    return `                    ListNode list1 = getTestList1(i);
                    ListNode list2 = getTestList2(i);
                    actual = ${parserVar}.mergeTwoLists(list1, list2);`;
  },

  // Generate helper methods for test input
  generateInputHelpers: (testCases) => {
    // Build helper method that creates list1 ListNode from array
    const buildList1Code = testCases.map((tc, idx) => {
      const list1 = tc.list1 !== undefined ? tc.list1 : null;
      if (!list1 || list1 === null || (Array.isArray(list1) && list1.length === 0)) {
        return `        if (index == ${idx}) return null;`;
      }
      
      if (!Array.isArray(list1)) {
        return `        if (index == ${idx}) return null;`;
      }
      
      if (list1.length === 0) {
        return `        if (index == ${idx}) return null;`;
      }
      
      // Build ListNode chain
      let code = `        if (index == ${idx}) {\n`;
      const nodeVars = [];
      list1.forEach((val, i) => {
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
    
    // Build helper method that creates list2 ListNode from array
    const buildList2Code = testCases.map((tc, idx) => {
      const list2 = tc.list2 !== undefined ? tc.list2 : null;
      if (!list2 || list2 === null || (Array.isArray(list2) && list2.length === 0)) {
        return `        if (index == ${idx}) return null;`;
      }
      
      if (!Array.isArray(list2)) {
        return `        if (index == ${idx}) return null;`;
      }
      
      if (list2.length === 0) {
        return `        if (index == ${idx}) return null;`;
      }
      
      // Build ListNode chain
      let code = `        if (index == ${idx}) {\n`;
      const nodeVars = [];
      list2.forEach((val, i) => {
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
    
    return `    private static ListNode getTestList1(int index) {
${buildList1Code}
        return null;
    }
    
    private static ListNode getTestList2(int index) {
${buildList2Code}
        return null;
    }`;
  },

  // Check if user code defines required classes/types (not needed for Merge Two Sorted Lists)
  checkUserDefinedClasses: (userCode) => {
    return {};
  },

  // Generate required helper classes/types if not in user code (not needed for Merge Two Sorted Lists)
  generateHelperClasses: () => {
    return '';
  },

  // Get the return type name for this challenge
  getReturnType: () => 'ListNode',

  // Get the serializer method name
  getSerializerMethod: () => 'serializeListNode',

  // Get default class name for this challenge
  getDefaultClassName: () => 'MergeTwoSortedLists',

  // Preprocess test cases (no preprocessing needed for Merge Two Sorted Lists)
  preprocessTestCases: (testCases) => testCases,

  // Transform user code (no transformation needed for Merge Two Sorted Lists)
  transformUserCode: (userCode, testCases) => userCode
};
