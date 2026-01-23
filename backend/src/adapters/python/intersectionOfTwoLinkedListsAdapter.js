import { pythonLiteral } from './utils.js';

function buildListLiteral(values) {
  return pythonLiteral(values);
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

  buildExpectedCode: (expected, indent = '    ', varName = 'expected') => {
    if (!expected || !Array.isArray(expected) || expected.length === 0) {
      return `${indent}${varName} = None\n`;
    }
    return `${indent}${varName} = build_list(${buildListLiteral(expected)})\n`;
  },

  generateSerializer: () => {
    return `def serialize_list_node(head):
    if head is None:
        return "null"
    values = []
    current = head
    while current is not None:
        values.append(str(current.val))
        current = current.next
    return "[" + ", ".join(values) + "]"
`;
  },

  generateInvocation: (parserVar) => {
    return `headA, headB = get_test_heads(i)
actual = ${parserVar}.getIntersectionNode(headA, headB)`;
  },

  generateInputHelpers: (testCases) => {
    return `def build_list(values):
    if values is None or len(values) == 0:
        return None
    dummy = ListNode(0)
    current = dummy
    for value in values:
        current.next = ListNode(value)
        current = current.next
    return dummy.next

def build_list_and_nodes(values):
    if values is None or len(values) == 0:
        return None, []
    head = ListNode(values[0])
    nodes = [head]
    current = head
    for value in values[1:]:
        current.next = ListNode(value)
        current = current.next
        nodes.append(current)
    return head, nodes

def get_test_heads(index):
    inputs = [
${testCases.map(tc => `        (${buildListLiteral(tc.listA !== undefined ? tc.listA : null)}, ${buildListLiteral(tc.listB !== undefined ? tc.listB : null)}, ${pythonLiteral(tc.skipA !== undefined ? tc.skipA : -1)}, ${pythonLiteral(tc.skipB !== undefined ? tc.skipB : -1)})`).join(',\n')}
    ]
    listA_vals, listB_vals, skipA, skipB = inputs[index]
    headA, nodesA = build_list_and_nodes(listA_vals)

    intersection_valid = (
        listA_vals is not None and len(listA_vals) > 0
        and listB_vals is not None and len(listB_vals) > 0
        and isinstance(skipA, int) and isinstance(skipB, int)
        and skipA >= 0 and skipB >= 0
        and skipA < len(listA_vals) and skipB < len(listB_vals)
    )

    headB = None
    if intersection_valid:
        intersection = nodesA[skipA]
        if skipB == 0:
            headB = intersection
        else:
            prefix_vals = listB_vals[:skipB]
            headB, nodesB = build_list_and_nodes(prefix_vals)
            if headB is None:
                headB = intersection
            else:
                nodesB[-1].next = intersection
    else:
        headB = build_list(listB_vals)

    return headA, headB
`;
  },

  checkUserDefinedClasses: () => ({}),
  generateHelperClasses: () => '',
  getReturnType: () => 'ListNode',
  getSerializerMethod: () => 'serialize_list_node',
  getDefaultClassName: () => 'IntersectionOfTwoLinkedLists',
  preprocessTestCases: (testCases) => testCases,
  transformUserCode: (userCode) => userCode
};
