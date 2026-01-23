// Maximum Average Subarray I test suite
//
// Test cases for findMaxAverage(int[] nums, int k) method
// Returns double: maximum average of any subarray of length k

export const runTests = [
  {
    id: 1,
    name: "Basic example",
    input: "nums = [1, 12, -5, -6, 50, 3], k = 4",
    nums: [1, 12, -5, -6, 50, 3],
    k: 4,
    expected: 12.75
  },
  {
    id: 2,
    name: "Single element",
    input: "nums = [5], k = 1",
    nums: [5],
    k: 1,
    expected: 5.0
  },
  {
    id: 3,
    name: "K equals 1",
    input: "nums = [0, 4, 0, 3, 2], k = 1",
    nums: [0, 4, 0, 3, 2],
    k: 1,
    expected: 4.0
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "K equals array length",
    input: "nums = [1, 2, 3, 4], k = 4",
    nums: [1, 2, 3, 4],
    k: 4,
    expected: 2.5
  },
  {
    id: 5,
    name: "All negative values",
    input: "nums = [-1, -12, -5, -6, -50, -3], k = 2",
    nums: [-1, -12, -5, -6, -50, -3],
    k: 2,
    expected: -5.5
  },
  {
    id: 6,
    name: "Max average at end",
    input: "nums = [7, 4, 5, 6, 8, 9], k = 3",
    nums: [7, 4, 5, 6, 8, 9],
    k: 3,
    expected: 7.6666666667
  },
  {
    id: 7,
    name: "Decreasing sequence",
    input: "nums = [5, 4, 3, 2, 1], k = 2",
    nums: [5, 4, 3, 2, 1],
    k: 2,
    expected: 4.5
  },
  {
    id: 8,
    name: "Negative sliding window",
    input: "nums = [0, -1, -2, -3, -4], k = 3",
    nums: [0, -1, -2, -3, -4],
    k: 3,
    expected: -1.0
  }
];
