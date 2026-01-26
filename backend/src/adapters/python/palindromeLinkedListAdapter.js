import { pythonLiteral } from './utils.js';

function buildListLiteral(values) {
  return pythonLiteral(values);
}

export default {
  extractInput: (testCase) => {
    return {
      head: testCase.head !== undefined ? testCase.head : null
    };
  },

  buildExpectedCode: (expected, indent = '    ', varName = 'expected') => {
    const value = expected ? 'True' : 'False';
    return `${indent}${varName} = ${value}\n`;
  },

  generateSerializer: () => {
    return `def serialize_boolean(value):
    if value is None:
        return "null"
    return "true" if value else "false"
`;
  },

  generateInvocation: (parserVar) => {
    return `head = get_test_head(i)
actual = ${parserVar}.isPalindrome(head)`;
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

def get_test_head(index):
    inputs = [
${testCases.map(tc => `        ${buildListLiteral(tc.head !== undefined ? tc.head : null)}`).join(',\n')}
    ]
    values = inputs[index]
    return build_list(values)
`;
  },

  checkUserDefinedClasses: () => ({}),
  generateHelperClasses: () => '',
  getReturnType: () => 'bool',
  getSerializerMethod: () => 'serialize_boolean',
  getDefaultClassName: () => 'PalindromeLinkedList',
  preprocessTestCases: (testCases) => testCases,
  transformUserCode: (userCode) => userCode
};
