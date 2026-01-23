/**
 * Adapter for Intersection of Two Linked Lists challenge
 * Handles getIntersectionNode(ListNode headA, ListNode headB) method that returns ListNode
 *
 * Note: ListNode.java is always provided as a top-level utility file.
 */

function buildListNodeFromArray(arr, indent = '        ', varName = 'head') {
  if (!arr || arr === null || (Array.isArray(arr) && arr.length === 0)) {
    return `${indent}ListNode ${varName} = null;\n`;
  }

  if (!Array.isArray(arr)) {
    return `${indent}ListNode ${varName} = null;\n`;
  }

  let code = '';
  const nodes = [];

  arr.forEach((val, idx) => {
    const nodeVar = `${varName}_node${idx}`;
    nodes.push(nodeVar);
    code += `${indent}ListNode ${nodeVar} = new ListNode(${val});\n`;
  });

  for (let i = 0; i < nodes.length - 1; i++) {
    code += `${indent}${nodes[i]}.next = ${nodes[i + 1]};\n`;
  }

  code += `${indent}ListNode ${varName} = ${nodes.length > 0 ? nodes[0] : 'null'};\n`;
  return code;
}

function buildExpectedListNodeCode(expected, indent = '        ', varName = 'expected') {
  if (!expected || expected === null || (Array.isArray(expected) && expected.length === 0)) {
    return `${indent}ListNode ${varName} = null;\n`;
  }

  if (!Array.isArray(expected)) {
    return `${indent}ListNode ${varName} = null;\n`;
  }

  return buildListNodeFromArray(expected, indent, varName);
}

function buildListNodes(arr, prefix) {
  const nodes = [];
  let code = '';
  arr.forEach((val, i) => {
    const nodeVar = `${prefix}${i}`;
    nodes.push(nodeVar);
    code += `            ListNode ${nodeVar} = new ListNode(${val});\n`;
  });
  for (let i = 0; i < nodes.length - 1; i++) {
    code += `            ${nodes[i]}.next = ${nodes[i + 1]};\n`;
  }
  return { code, nodes };
}

export default {
  extractInput: (testCase) => {
    return {
      listA: testCase.listA !== undefined ? testCase.listA : null,
      listB: testCase.listB !== undefined ? testCase.listB : null,
      skipA: testCase.skipA !== undefined ? testCase.skipA : -1,
      skipB: testCase.skipB !== undefined ? testCase.skipB : -1
    };
  },

  buildExpectedCode: (expected, indent = '        ', varName = 'expected') => {
    return buildExpectedListNodeCode(expected, indent, varName);
  },

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

  generateInvocation: (parserVar) => {
    return `                    ListNode[] heads = getTestHeads(i);
                    ListNode headA = heads[0];
                    ListNode headB = heads[1];
                    actual = ${parserVar}.getIntersectionNode(headA, headB);`;
  },

  generateInputHelpers: (testCases) => {
    const buildCases = testCases.map((tc, idx) => {
      const listA = tc.listA !== undefined ? tc.listA : null;
      const listB = tc.listB !== undefined ? tc.listB : null;
      const skipA = tc.skipA !== undefined ? tc.skipA : -1;
      const skipB = tc.skipB !== undefined ? tc.skipB : -1;

      const listAValid = Array.isArray(listA) && listA.length > 0;
      const listBValid = Array.isArray(listB) && listB.length > 0;
      const intersectionValid = listAValid
        && listBValid
        && Number.isInteger(skipA)
        && Number.isInteger(skipB)
        && skipA >= 0
        && skipB >= 0
        && skipA < listA.length
        && skipB < listB.length;

      let code = `        if (index == ${idx}) {\n`;
      code += `            ListNode headA = null;\n`;
      code += `            ListNode headB = null;\n`;

      if (listAValid) {
        const { code: aCode, nodes: aNodes } = buildListNodes(listA, `a${idx}_`);
        code += aCode;
        code += `            headA = ${aNodes[0]};\n`;
        if (intersectionValid) {
          code += `            ListNode intersection = ${aNodes[skipA]};\n`;
          if (skipB === 0) {
            code += `            headB = intersection;\n`;
          } else {
            const prefixValues = listB.slice(0, skipB);
            const { code: bCode, nodes: bNodes } = buildListNodes(prefixValues, `b${idx}_`);
            code += bCode;
            if (bNodes.length > 0) {
              code += `            ${bNodes[bNodes.length - 1]}.next = intersection;\n`;
              code += `            headB = ${bNodes[0]};\n`;
            } else {
              code += `            headB = intersection;\n`;
            }
          }
        }
      }

      if (!intersectionValid) {
        if (listBValid) {
          const { code: bCode, nodes: bNodes } = buildListNodes(listB, `b${idx}_`);
          code += bCode;
          code += `            headB = ${bNodes[0]};\n`;
        }
      }

      code += `            return new ListNode[] { headA, headB };\n`;
      code += `        }`;
      return code;
    }).join('\n');

    return `    private static ListNode[] getTestHeads(int index) {
${buildCases}
        return new ListNode[] { null, null };
    }`;
  },

  checkUserDefinedClasses: () => ({}),
  generateHelperClasses: () => '',
  getReturnType: () => 'ListNode',
  getSerializerMethod: () => 'serializeListNode',
  getDefaultClassName: () => 'IntersectionOfTwoLinkedLists',
  preprocessTestCases: (testCases) => testCases,
  transformUserCode: (userCode) => userCode
};
