// Linked List Cycle test suite
//
// Test cases for hasCycle(ListNode head) method
// Returns boolean: true if a cycle exists, otherwise false
// Test cases use array representation plus pos for cycle connection

export const runTests = [
  {
    id: 1,
    name: "Cycle in middle",
    input: "head = [3, 2, 0, -4], pos = 1",
    head: [3, 2, 0, -4],
    pos: 1,
    expected: true
  },
  {
    id: 2,
    name: "Two nodes cycle to head",
    input: "head = [1, 2], pos = 0",
    head: [1, 2],
    pos: 0,
    expected: true
  },
  {
    id: 3,
    name: "Single node no cycle",
    input: "head = [1], pos = -1",
    head: [1],
    pos: -1,
    expected: false
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Empty list",
    input: "head = [], pos = -1",
    head: null,
    pos: -1,
    expected: false
  },
  {
    id: 5,
    name: "Single node cycle",
    input: "head = [1], pos = 0",
    head: [1],
    pos: 0,
    expected: true
  },
  {
    id: 6,
    name: "Longer list cycle",
    input: "head = [1, 2, 3, 4, 5], pos = 2",
    head: [1, 2, 3, 4, 5],
    pos: 2,
    expected: true
  },
  {
    id: 7,
    name: "No cycle longer list",
    input: "head = [1, 2, 3, 4, 5], pos = -1",
    head: [1, 2, 3, 4, 5],
    pos: -1,
    expected: false
  },
  {
    id: 8,
    name: "Cycle to tail",
    input: "head = [1, 2, 3], pos = 2",
    head: [1, 2, 3],
    pos: 2,
    expected: true
  },
  {
    id: 9,
    name: "Negative values no cycle",
    input: "head = [-1, -2, -3], pos = -1",
    head: [-1, -2, -3],
    pos: -1,
    expected: false
  },
  {
    id: 10,
    name: "Cycle to middle",
    input: "head = [10, 20, 30, 40], pos = 1",
    head: [10, 20, 30, 40],
    pos: 1,
    expected: true
  }
];
