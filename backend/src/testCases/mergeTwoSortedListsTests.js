// Merge Two Sorted Lists test suite
//
// Test cases for mergeTwoLists(ListNode list1, ListNode list2) method
// Returns ListNode: the head of the merged sorted linked list
// Test cases use array representation: [1,2,3] represents 1->2->3

export const runTests = [
  {
    id: 1,
    name: "Basic merge",
    input: "list1 = [1, 2, 4], list2 = [1, 3, 4]",
    list1: [1, 2, 4],
    list2: [1, 3, 4],
    expected: [1, 1, 2, 3, 4, 4]
  },
  {
    id: 2,
    name: "One empty list",
    input: "list1 = [], list2 = [0]",
    list1: null,
    list2: [0],
    expected: [0]
  },
  {
    id: 3,
    name: "Both empty",
    input: "list1 = [], list2 = []",
    list1: null,
    list2: null,
    expected: null
  }
];

export const submitTests = [
  ...runTests,
  
  {
    id: 4,
    name: "Alternating merge",
    input: "list1 = [1, 3, 5], list2 = [2, 4, 6]",
    list1: [1, 3, 5],
    list2: [2, 4, 6],
    expected: [1, 2, 3, 4, 5, 6]
  },
  {
    id: 5,
    name: "First list longer",
    input: "list1 = [1, 2, 3, 4, 5], list2 = [1]",
    list1: [1, 2, 3, 4, 5],
    list2: [1],
    expected: [1, 1, 2, 3, 4, 5]
  },
  {
    id: 6,
    name: "Second list longer",
    input: "list1 = [1], list2 = [2, 3, 4, 5, 6]",
    list1: [1],
    list2: [2, 3, 4, 5, 6],
    expected: [1, 2, 3, 4, 5, 6]
  },
  {
    id: 7,
    name: "Negative values",
    input: "list1 = [-5, -3, -1], list2 = [-4, -2, 0]",
    list1: [-5, -3, -1],
    list2: [-4, -2, 0],
    expected: [-5, -4, -3, -2, -1, 0]
  },
  {
    id: 8,
    name: "Mixed positive and negative",
    input: "list1 = [-1, 2, 4], list2 = [0, 3, 5]",
    list1: [-1, 2, 4],
    list2: [0, 3, 5],
    expected: [-1, 0, 2, 3, 4, 5]
  },
  {
    id: 9,
    name: "Duplicate values",
    input: "list1 = [1, 1, 2, 3], list2 = [1, 2, 2, 4]",
    list1: [1, 1, 2, 3],
    list2: [1, 2, 2, 4],
    expected: [1, 1, 1, 2, 2, 2, 3, 4]
  },
  {
    id: 10,
    name: "Single nodes",
    input: "list1 = [1], list2 = [2]",
    list1: [1],
    list2: [2],
    expected: [1, 2]
  },
  {
    id: 11,
    name: "Same values",
    input: "list1 = [1, 1, 1], list2 = [1, 1, 1]",
    list1: [1, 1, 1],
    list2: [1, 1, 1],
    expected: [1, 1, 1, 1, 1, 1]
  },
  {
    id: 12,
    name: "Zero values",
    input: "list1 = [0, 1, 2], list2 = [0, 0, 3]",
    list1: [0, 1, 2],
    list2: [0, 0, 3],
    expected: [0, 0, 0, 1, 2, 3]
  },
  {
    id: 13,
    name: "First list all smaller",
    input: "list1 = [1, 2, 3], list2 = [4, 5, 6]",
    list1: [1, 2, 3],
    list2: [4, 5, 6],
    expected: [1, 2, 3, 4, 5, 6]
  },
  {
    id: 14,
    name: "Second list all smaller",
    input: "list1 = [4, 5, 6], list2 = [1, 2, 3]",
    list1: [4, 5, 6],
    list2: [1, 2, 3],
    expected: [1, 2, 3, 4, 5, 6]
  },
  {
    id: 15,
    name: "Large values",
    input: "list1 = [100, 200], list2 = [150, 250]",
    list1: [100, 200],
    list2: [150, 250],
    expected: [100, 150, 200, 250]
  }
];
