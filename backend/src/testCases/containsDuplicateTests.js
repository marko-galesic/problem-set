// Contains Duplicate test suite
//
// Test cases for containsDuplicate(int[] nums) method
// Returns boolean: true if any value appears at least twice

export const runTests = [
  {
    id: 1,
    name: "Duplicate exists",
    input: "nums = [1, 2, 3, 1]",
    nums: [1, 2, 3, 1],
    expected: true
  },
  {
    id: 2,
    name: "All unique",
    input: "nums = [1, 2, 3, 4]",
    nums: [1, 2, 3, 4],
    expected: false
  },
  {
    id: 3,
    name: "Multiple duplicates",
    input: "nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]",
    nums: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2],
    expected: true
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Empty array",
    input: "nums = []",
    nums: [],
    expected: false
  },
  {
    id: 5,
    name: "Single element",
    input: "nums = [42]",
    nums: [42],
    expected: false
  },
  {
    id: 6,
    name: "Negative numbers with duplicate",
    input: "nums = [-1, -2, -3, -1]",
    nums: [-1, -2, -3, -1],
    expected: true
  },
  {
    id: 7,
    name: "Zeros duplicate",
    input: "nums = [0, 0]",
    nums: [0, 0],
    expected: true
  },
  {
    id: 8,
    name: "Duplicate far apart",
    input: "nums = [5, 4, 3, 2, 1, 5]",
    nums: [5, 4, 3, 2, 1, 5],
    expected: true
  },
  {
    id: 9,
    name: "Larger unique set",
    input: "nums = [6, 7, 8, 9, 10]",
    nums: [6, 7, 8, 9, 10],
    expected: false
  }
];
