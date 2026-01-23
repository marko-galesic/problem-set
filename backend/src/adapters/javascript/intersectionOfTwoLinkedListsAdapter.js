import { serializeListNode } from '../helpers/javascript.js';

function buildExpectedListNodeCode(expected, indent = '  ', varName = 'expected') {
  if (!expected || expected === null || (Array.isArray(expected) && expected.length === 0)) {
    return `${indent}let ${varName} = null;\n`;
  }
  if (!Array.isArray(expected)) {
    return `${indent}let ${varName} = null;\n`;
  }
  let code = '';
  const nodes = [];
  expected.forEach((val, idx) => {
    const nodeVar = `${varName}_node${idx}`;
    nodes.push(nodeVar);
    code += `${indent}const ${nodeVar} = new ListNode(${val});\n`;
  });
  for (let i = 0; i < nodes.length - 1; i++) {
    code += `${indent}${nodes[i]}.next = ${nodes[i + 1]};\n`;
  }
  code += `${indent}let ${varName} = ${nodes.length > 0 ? nodes[0] : 'null'};\n`;
  return code;
}

export default {
  extractInput: (testCase) => ({
    listA: testCase.listA !== undefined ? testCase.listA : null,
    listB: testCase.listB !== undefined ? testCase.listB : null,
    skipA: testCase.skipA !== undefined ? testCase.skipA : -1,
    skipB: testCase.skipB !== undefined ? testCase.skipB : -1
  }),
  buildExpectedCode: (expected, indent = '  ', varName = 'expected') => {
    return buildExpectedListNodeCode(expected, indent, varName);
  },
  generateSerializer: () => serializeListNode(),
  generateInvocation: (parserVar) => {
    return `const [headA, headB] = getTestHeads(i);
          actual = ${parserVar}.getIntersectionNode(headA, headB);`;
  },
  generateInputHelpers: (testCases) => {
    return `function buildList(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return null;
  }
  const dummy = new ListNode(0);
  let current = dummy;
  for (const value of values) {
    current.next = new ListNode(value);
    current = current.next;
  }
  return dummy.next;
}

function buildListAndNodes(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return { head: null, nodes: [] };
  }
  const head = new ListNode(values[0]);
  const nodes = [head];
  let current = head;
  for (const value of values.slice(1)) {
    current.next = new ListNode(value);
    current = current.next;
    nodes.push(current);
  }
  return { head, nodes };
}

function getTestHeads(index) {
  const inputs = [
${testCases.map(tc => `    { listA: ${JSON.stringify(tc.listA ?? null)}, listB: ${JSON.stringify(tc.listB ?? null)}, skipA: ${tc.skipA ?? -1}, skipB: ${tc.skipB ?? -1} }`).join(',\n')}
  ];
  const { listA, listB, skipA, skipB } = inputs[index];
  const { head: headA, nodes: nodesA } = buildListAndNodes(listA);

  const intersectionValid = Array.isArray(listA)
    && listA.length > 0
    && Array.isArray(listB)
    && listB.length > 0
    && Number.isInteger(skipA)
    && Number.isInteger(skipB)
    && skipA >= 0
    && skipB >= 0
    && skipA < listA.length
    && skipB < listB.length;

  let headB = null;
  if (intersectionValid) {
    const intersection = nodesA[skipA];
    if (skipB === 0) {
      headB = intersection;
    } else {
      const prefix = listB.slice(0, skipB);
      const built = buildListAndNodes(prefix);
      headB = built.head;
      if (headB) {
        built.nodes[built.nodes.length - 1].next = intersection;
      } else {
        headB = intersection;
      }
    }
  } else {
    headB = buildList(listB);
  }

  return [headA, headB];
}`;
  },
  checkUserDefinedClasses: () => ({}),
  generateHelperClasses: () => '',
  getReturnType: () => 'ListNode',
  getSerializerMethod: () => 'serializeListNode',
  getDefaultClassName: () => 'IntersectionOfTwoLinkedLists'
};
