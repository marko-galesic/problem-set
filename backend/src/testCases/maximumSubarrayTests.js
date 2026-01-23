// Maximum Subarray test suite
//
// Test cases for maxSubArray(int[] nums) method
// Returns int: maximum sum of a contiguous subarray

export const runTests = [
  {
    id: 1,
    name: "Classic example",
    input: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
    nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
    expected: 6
  },
  {
    id: 2,
    name: "Single element",
    input: "nums = [1]",
    nums: [1],
    expected: 1
  },
  {
    id: 3,
    name: "Mostly positive",
    input: "nums = [5, 4, -1, 7, 8]",
    nums: [5, 4, -1, 7, 8],
    expected: 23
  },
  {
    id: 4,
    name: "All negative values",
    input: "nums = [-1, -2, -3]",
    nums: [-1, -2, -3],
    expected: -1
  },
  {
    id: 5,
    name: "Zero mixed with positives",
    input: "nums = [0, -1, 2, 3, -5, 4]",
    nums: [0, -1, 2, 3, -5, 4],
    expected: 5
  }
];

export const submitTests = [
  ...runTests
];
