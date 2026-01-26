import { pythonLiteral } from './utils.js';

function buildListLiteral(values) {
  return pythonLiteral(values);
}

export default {
  extractInput: (testCase) => {
    return {
      head: testCase.head !== undefined ? testCase.head : null,
      n: testCase.n !== undefined ? testCase.n : 0
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
    return `head, n = get_test_input(i)
actual = ${parserVar}.removeNthFromEnd(head, n)`;
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

def get_test_input(index):
    inputs = [
${testCases.map(tc => `        (${buildListLiteral(tc.head !== undefined ? tc.head : null)}, ${pythonLiteral(tc.n !== undefined ? tc.n : 0)})`).join(',\n')}
    ]
    values, n = inputs[index]
    return build_list(values), n
`;
  },

  checkUserDefinedClasses: () => ({}),
  generateHelperClasses: () => '',
  getReturnType: () => 'ListNode',
  getSerializerMethod: () => 'serialize_list_node',
  getDefaultClassName: () => 'RemoveNthNodeFromEndOfList',
  preprocessTestCases: (testCases) => testCases,
  transformUserCode: (userCode) => userCode
};
