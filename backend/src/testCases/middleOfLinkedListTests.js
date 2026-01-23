// Middle of the Linked List test suite
//
// Test cases for middleNode(ListNode head) method
// Returns ListNode: the head of the middle sublist
// Test cases use array representation: [1,2,3] represents 1->2->3

export const runTests = [
  {
    id: 1,
    name: "Odd length list",
    input: "head = [1, 2, 3, 4, 5]",
    head: [1, 2, 3, 4, 5],
    expected: [3, 4, 5]
  },
  {
    id: 2,
    name: "Even length list",
    input: "head = [1, 2, 3, 4, 5, 6]",
    head: [1, 2, 3, 4, 5, 6],
    expected: [4, 5, 6]
  },
  {
    id: 3,
    name: "Single node",
    input: "head = [1]",
    head: [1],
    expected: [1]
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Empty list",
    input: "head = []",
    head: null,
    expected: null
  },
  {
    id: 5,
    name: "Two nodes",
    input: "head = [1, 2]",
    head: [1, 2],
    expected: [2]
  },
  {
    id: 6,
    name: "Three nodes",
    input: "head = [1, 2, 3]",
    head: [1, 2, 3],
    expected: [2, 3]
  },
  {
    id: 7,
    name: "Four nodes",
    input: "head = [1, 2, 3, 4]",
    head: [1, 2, 3, 4],
    expected: [3, 4]
  },
  {
    id: 8,
    name: "Negative values",
    input: "head = [-1, -2, -3, -4, -5]",
    head: [-1, -2, -3, -4, -5],
    expected: [-3, -4, -5]
  },
  {
    id: 9,
    name: "Mixed values",
    input: "head = [0, 5, -1, 7]",
    head: [0, 5, -1, 7],
    expected: [-1, 7]
  },
  {
    id: 10,
    name: "Larger odd list",
    input: "head = [1, 2, 3, 4, 5, 6, 7]",
    head: [1, 2, 3, 4, 5, 6, 7],
    expected: [4, 5, 6, 7]
  },
  {
    id: 11,
    name: "Repeated values",
    input: "head = [2, 2, 2, 2]",
    head: [2, 2, 2, 2],
    expected: [2, 2]
  },
  {
    id: 12,
    name: "Longer odd sequence",
    input: "head = [1, 2, 3, 4, 5, 6, 7, 8, 9]",
    head: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    expected: [5, 6, 7, 8, 9]
  }
];
