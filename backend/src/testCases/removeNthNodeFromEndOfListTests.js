// Remove Nth Node From End of List test suite
//
// Test cases for removeNthFromEnd(ListNode head, int n) method
// Returns ListNode: the head of the list after removing the nth node from the end
// Test cases use array representation: [1,2,3] represents 1->2->3

export const runTests = [
  {
    id: 1,
    name: "Basic removal",
    input: "head = [1, 2, 3, 4, 5], n = 2",
    head: [1, 2, 3, 4, 5],
    n: 2,
    expected: [1, 2, 3, 5]
  },
  {
    id: 2,
    name: "Remove head",
    input: "head = [1, 2, 3], n = 3",
    head: [1, 2, 3],
    n: 3,
    expected: [2, 3]
  },
  {
    id: 3,
    name: "Single node",
    input: "head = [1], n = 1",
    head: [1],
    n: 1,
    expected: null
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Remove last",
    input: "head = [1, 2, 3], n = 1",
    head: [1, 2, 3],
    n: 1,
    expected: [1, 2]
  },
  {
    id: 5,
    name: "Two nodes remove head",
    input: "head = [1, 2], n = 2",
    head: [1, 2],
    n: 2,
    expected: [2]
  },
  {
    id: 6,
    name: "Even list middle removal",
    input: "head = [1, 2, 3, 4], n = 2",
    head: [1, 2, 3, 4],
    n: 2,
    expected: [1, 2, 4]
  },
  {
    id: 7,
    name: "Odd list middle removal",
    input: "head = [1, 2, 3, 4, 5], n = 3",
    head: [1, 2, 3, 4, 5],
    n: 3,
    expected: [1, 2, 4, 5]
  },
  {
    id: 8,
    name: "Negative values",
    input: "head = [-1, -2, -3, -4], n = 2",
    head: [-1, -2, -3, -4],
    n: 2,
    expected: [-1, -2, -4]
  },
  {
    id: 9,
    name: "Zero values",
    input: "head = [0, 0, 0], n = 1",
    head: [0, 0, 0],
    n: 1,
    expected: [0, 0]
  },
  {
    id: 10,
    name: "Longer list",
    input: "head = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], n = 5",
    head: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    n: 5,
    expected: [1, 2, 3, 4, 5, 7, 8, 9, 10]
  },
  {
    id: 11,
    name: "Remove head in longer list",
    input: "head = [10, 20, 30, 40], n = 4",
    head: [10, 20, 30, 40],
    n: 4,
    expected: [20, 30, 40]
  },
  {
    id: 12,
    name: "Two nodes remove last",
    input: "head = [7, 8], n = 1",
    head: [7, 8],
    n: 1,
    expected: [7]
  }
];
