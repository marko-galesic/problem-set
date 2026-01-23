// Find Minimum in Rotated Sorted Array test suite
//
// Test cases for findMin(int[] nums) method
// Returns int: minimum element in rotated sorted array

export const runTests = [
  {
    id: 1,
    name: "Rotated in the middle",
    input: "nums = [3, 4, 5, 1, 2]",
    nums: [3, 4, 5, 1, 2],
    expected: 1
  },
  {
    id: 2,
    name: "Not rotated",
    input: "nums = [1, 2, 3, 4, 5]",
    nums: [1, 2, 3, 4, 5],
    expected: 1
  },
  {
    id: 3,
    name: "Single element",
    input: "nums = [10]",
    nums: [10],
    expected: 10
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Two elements rotated",
    input: "nums = [2, 1]",
    nums: [2, 1],
    expected: 1
  },
  {
    id: 5,
    name: "Pivot near the end",
    input: "nums = [4, 5, 6, 7, 0, 1, 2]",
    nums: [4, 5, 6, 7, 0, 1, 2],
    expected: 0
  },
  {
    id: 6,
    name: "Rotation with negatives",
    input: "nums = [0, 1, 2, -4, -3, -2, -1]",
    nums: [0, 1, 2, -4, -3, -2, -1],
    expected: -4
  }
];
