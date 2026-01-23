import { pythonLiteral } from './utils.js';

function buildListLiteral(values) {
  return pythonLiteral(values);
}

export default {
  extractInput: (testCase) => {
    return {
      list1: testCase.list1 !== undefined ? testCase.list1 : null,
      list2: testCase.list2 !== undefined ? testCase.list2 : null
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
    return `list1 = get_test_list1(i)
list2 = get_test_list2(i)
actual = ${parserVar}.mergeTwoLists(list1, list2)`;
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

def get_test_list1(index):
    inputs = [
${testCases.map(tc => `        ${buildListLiteral(tc.list1 !== undefined ? tc.list1 : null)}`).join(',\n')}
    ]
    values = inputs[index]
    return build_list(values)

def get_test_list2(index):
    inputs = [
${testCases.map(tc => `        ${buildListLiteral(tc.list2 !== undefined ? tc.list2 : null)}`).join(',\n')}
    ]
    values = inputs[index]
    return build_list(values)
`;
  },

  checkUserDefinedClasses: () => ({}),
  generateHelperClasses: () => '',
  getReturnType: () => 'ListNode',
  getSerializerMethod: () => 'serialize_list_node',
  getDefaultClassName: () => 'MergeTwoSortedLists',
  preprocessTestCases: (testCases) => testCases,
  transformUserCode: (userCode) => userCode
};
