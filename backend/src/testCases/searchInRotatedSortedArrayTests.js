// Search in Rotated Sorted Array test suite
//
// Test cases for search(int[] nums, int target) method
// Returns int: index of target or -1 if not found

export const runTests = [
  {
    id: 1,
    name: "Target in rotated array",
    input: "nums = [4, 5, 6, 7, 0, 1, 2], target = 0",
    nums: [4, 5, 6, 7, 0, 1, 2],
    target: 0,
    expected: 4
  },
  {
    id: 2,
    name: "Target not present",
    input: "nums = [4, 5, 6, 7, 0, 1, 2], target = 3",
    nums: [4, 5, 6, 7, 0, 1, 2],
    target: 3,
    expected: -1
  },
  {
    id: 3,
    name: "No rotation",
    input: "nums = [1, 2, 3, 4, 5], target = 4",
    nums: [1, 2, 3, 4, 5],
    target: 4,
    expected: 3
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Pivot near start",
    input: "nums = [6, 7, 1, 2, 3, 4, 5], target = 6",
    nums: [6, 7, 1, 2, 3, 4, 5],
    target: 6,
    expected: 0
  },
  {
    id: 5,
    name: "Pivot near end",
    input: "nums = [2, 3, 4, 5, 6, 7, 1], target = 1",
    nums: [2, 3, 4, 5, 6, 7, 1],
    target: 1,
    expected: 6
  },
  {
    id: 6,
    name: "Two elements rotated",
    input: "nums = [3, 1], target = 1",
    nums: [3, 1],
    target: 1,
    expected: 1
  },
  {
    id: 7,
    name: "Single element found",
    input: "nums = [10], target = 10",
    nums: [10],
    target: 10,
    expected: 0
  },
  {
    id: 8,
    name: "Single element missing",
    input: "nums = [10], target = 5",
    nums: [10],
    target: 5,
    expected: -1
  },
  {
    id: 9,
    name: "Empty array",
    input: "nums = [], target = 1",
    nums: [],
    target: 1,
    expected: -1
  },
  {
    id: 10,
    name: "Target at end",
    input: "nums = [5, 6, 7, 1, 2, 3, 4], target = 4",
    nums: [5, 6, 7, 1, 2, 3, 4],
    target: 4,
    expected: 6
  }
];
