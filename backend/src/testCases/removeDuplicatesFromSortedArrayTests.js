// Remove Duplicates from Sorted Array test suite
//
// Test cases for removeDuplicates(int[] nums) method
// Returns int: count of unique elements after in-place removal

export const runTests = [
  {
    id: 1,
    name: "Basic example",
    input: "nums = [1, 1, 2]",
    nums: [1, 1, 2],
    expected: 2
  },
  {
    id: 2,
    name: "Multiple duplicates",
    input: "nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]",
    nums: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4],
    expected: 5
  },
  {
    id: 3,
    name: "No duplicates",
    input: "nums = [1, 2, 3, 4]",
    nums: [1, 2, 3, 4],
    expected: 4
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Empty array",
    input: "nums = []",
    nums: [],
    expected: 0
  },
  {
    id: 5,
    name: "Single element",
    input: "nums = [7]",
    nums: [7],
    expected: 1
  },
  {
    id: 6,
    name: "All duplicates",
    input: "nums = [2, 2, 2, 2]",
    nums: [2, 2, 2, 2],
    expected: 1
  },
  {
    id: 7,
    name: "Negatives and duplicates",
    input: "nums = [-3, -3, -1, 0, 0, 2]",
    nums: [-3, -3, -1, 0, 0, 2],
    expected: 4
  },
  {
    id: 8,
    name: "Duplicates at end",
    input: "nums = [1, 2, 3, 3, 3]",
    nums: [1, 2, 3, 3, 3],
    expected: 3
  }
];
