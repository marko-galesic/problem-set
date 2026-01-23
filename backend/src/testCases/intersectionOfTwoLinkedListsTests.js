// Intersection of Two Linked Lists test suite
//
// Test cases for getIntersectionNode(ListNode headA, ListNode headB)
// Returns ListNode: the node where the two lists intersect, or null
// Test cases use array representation plus skipA/skipB for shared tail

export const runTests = [
  {
    id: 1,
    name: "Intersection in middle",
    input: "listA = [4, 1, 8, 4, 5], listB = [5, 6, 1, 8, 4, 5], skipA = 2, skipB = 3",
    listA: [4, 1, 8, 4, 5],
    listB: [5, 6, 1, 8, 4, 5],
    skipA: 2,
    skipB: 3,
    expected: [8, 4, 5]
  },
  {
    id: 2,
    name: "Intersection near tail",
    input: "listA = [1, 9, 1, 2, 4], listB = [3, 2, 4], skipA = 3, skipB = 1",
    listA: [1, 9, 1, 2, 4],
    listB: [3, 2, 4],
    skipA: 3,
    skipB: 1,
    expected: [2, 4]
  },
  {
    id: 3,
    name: "No intersection",
    input: "listA = [2, 6, 4], listB = [1, 5], skipA = -1, skipB = -1",
    listA: [2, 6, 4],
    listB: [1, 5],
    skipA: -1,
    skipB: -1,
    expected: null
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Intersection at head",
    input: "listA = [1, 2, 3], listB = [1, 2, 3], skipA = 0, skipB = 0",
    listA: [1, 2, 3],
    listB: [1, 2, 3],
    skipA: 0,
    skipB: 0,
    expected: [1, 2, 3]
  },
  {
    id: 5,
    name: "Single node intersection",
    input: "listA = [7], listB = [7], skipA = 0, skipB = 0",
    listA: [7],
    listB: [7],
    skipA: 0,
    skipB: 0,
    expected: [7]
  },
  {
    id: 6,
    name: "Intersection at tail",
    input: "listA = [1, 2, 3, 4], listB = [9, 4], skipA = 3, skipB = 1",
    listA: [1, 2, 3, 4],
    listB: [9, 4],
    skipA: 3,
    skipB: 1,
    expected: [4]
  },
  {
    id: 7,
    name: "Same values no shared nodes",
    input: "listA = [1, 2, 3], listB = [1, 2, 3], skipA = -1, skipB = -1",
    listA: [1, 2, 3],
    listB: [1, 2, 3],
    skipA: -1,
    skipB: -1,
    expected: null
  },
  {
    id: 8,
    name: "List A empty",
    input: "listA = [], listB = [1, 2, 3], skipA = -1, skipB = -1",
    listA: null,
    listB: [1, 2, 3],
    skipA: -1,
    skipB: -1,
    expected: null
  },
  {
    id: 9,
    name: "List B empty",
    input: "listA = [1], listB = [], skipA = -1, skipB = -1",
    listA: [1],
    listB: null,
    skipA: -1,
    skipB: -1,
    expected: null
  },
  {
    id: 10,
    name: "Intersection after short prefix",
    input: "listA = [2, 3], listB = [1, 2, 3], skipA = 0, skipB = 1",
    listA: [2, 3],
    listB: [1, 2, 3],
    skipA: 0,
    skipB: 1,
    expected: [2, 3]
  }
];
