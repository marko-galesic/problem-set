// Reverse Linked List test suite
//
// Test cases for reverseList(ListNode head) method
// Returns ListNode: the head of the reversed linked list
// Test cases use array representation: [1,2,3] represents 1->2->3

export const runTests = [
  {
    id: 1,
    name: "Basic reversal",
    input: "head = [1, 2, 3, 4, 5]",
    head: [1, 2, 3, 4, 5],
    expected: [5, 4, 3, 2, 1]
  },
  {
    id: 2,
    name: "Two nodes",
    input: "head = [1, 2]",
    head: [1, 2],
    expected: [2, 1]
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
    name: "Three nodes",
    input: "head = [1, 2, 3]",
    head: [1, 2, 3],
    expected: [3, 2, 1]
  },
  {
    id: 6,
    name: "Longer list",
    input: "head = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]",
    head: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    expected: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
  },
  {
    id: 7,
    name: "Negative values",
    input: "head = [-1, -2, -3]",
    head: [-1, -2, -3],
    expected: [-3, -2, -1]
  },
  {
    id: 8,
    name: "Mixed positive and negative",
    input: "head = [-1, 2, -3, 4]",
    head: [-1, 2, -3, 4],
    expected: [4, -3, 2, -1]
  },
  {
    id: 9,
    name: "Zero values",
    input: "head = [0, 1, 0]",
    head: [0, 1, 0],
    expected: [0, 1, 0]
  },
  {
    id: 10,
    name: "Large values",
    input: "head = [1000, 2000, 3000]",
    head: [1000, 2000, 3000],
    expected: [3000, 2000, 1000]
  },
  {
    id: 11,
    name: "Single element with zero",
    input: "head = [0]",
    head: [0],
    expected: [0]
  },
  {
    id: 12,
    name: "Four nodes",
    input: "head = [1, 2, 3, 4]",
    head: [1, 2, 3, 4],
    expected: [4, 3, 2, 1]
  }
];
