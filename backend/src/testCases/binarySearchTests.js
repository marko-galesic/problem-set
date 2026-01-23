// Binary Search test suite
//
// Test cases for binarySearch(int[] nums, int target) method
// Returns int: index of target or -1 if not found

export const runTests = [
  {
    id: 1,
    name: "Target in middle",
    input: "nums = [1, 3, 5, 7, 9], target = 5",
    nums: [1, 3, 5, 7, 9],
    target: 5,
    expected: 2
  },
  {
    id: 2,
    name: "Target at start",
    input: "nums = [2, 4, 6, 8], target = 2",
    nums: [2, 4, 6, 8],
    target: 2,
    expected: 0
  },
  {
    id: 3,
    name: "Target at end",
    input: "nums = [1, 2, 3, 4, 5], target = 5",
    nums: [1, 2, 3, 4, 5],
    target: 5,
    expected: 4
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Not found",
    input: "nums = [1, 2, 4, 6], target = 3",
    nums: [1, 2, 4, 6],
    target: 3,
    expected: -1
  },
  {
    id: 5,
    name: "Empty array",
    input: "nums = [], target = 1",
    nums: [],
    target: 1,
    expected: -1
  },
  {
    id: 6,
    name: "Single element found",
    input: "nums = [10], target = 10",
    nums: [10],
    target: 10,
    expected: 0
  }
];
