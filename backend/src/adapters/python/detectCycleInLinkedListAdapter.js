import { pythonLiteral } from './utils.js';

export default {
  extractInput: (testCase) => {
    return {
      head: testCase.head !== undefined ? testCase.head : null,
      pos: testCase.pos !== undefined ? testCase.pos : -1
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
actual = ${parserVar}.detectCycleInLinkedList(head)`;
  },

  generateInputHelpers: (testCases) => {
    return `def build_list_with_cycle(values, pos):
    if values is None or len(values) == 0:
        return None
    head = ListNode(values[0])
    nodes = [head]
    current = head
    for value in values[1:]:
        current.next = ListNode(value)
        current = current.next
        nodes.append(current)
    if pos is not None and pos >= 0 and pos < len(nodes):
        current.next = nodes[pos]
    return head

def get_test_head(index):
    inputs = [
${testCases.map(tc => `        (${pythonLiteral(tc.head !== undefined ? tc.head : null)}, ${pythonLiteral(tc.pos !== undefined ? tc.pos : -1)})`).join(',\n')}
    ]
    values, pos = inputs[index]
    return build_list_with_cycle(values, pos)
`;
  },

  checkUserDefinedClasses: () => ({}),
  generateHelperClasses: () => '',
  getReturnType: () => 'bool',
  getSerializerMethod: () => 'serialize_boolean',
  getDefaultClassName: () => 'DetectCycleInLinkedList',
  preprocessTestCases: (testCases) => testCases,
  transformUserCode: (userCode) => userCode
};
