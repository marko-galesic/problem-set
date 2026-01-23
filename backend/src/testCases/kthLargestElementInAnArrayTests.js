// Kth Largest Element in an Array test suite
//
// Test cases for findKthLargest(int[] nums, int k) method
// Returns int: the k-th largest element in the array

export const runTests = [
  {
    id: 1,
    name: "Basic example",
    input: "nums = [3, 2, 1, 5, 6, 4], k = 2",
    nums: [3, 2, 1, 5, 6, 4],
    k: 2,
    expected: 5
  },
  {
    id: 2,
    name: "With duplicates",
    input: "nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4",
    nums: [3, 2, 3, 1, 2, 4, 5, 5, 6],
    k: 4,
    expected: 4
  },
  {
    id: 3,
    name: "Single element",
    input: "nums = [1], k = 1",
    nums: [1],
    k: 1,
    expected: 1
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "All elements equal",
    input: "nums = [7, 7, 7, 7], k = 3",
    nums: [7, 7, 7, 7],
    k: 3,
    expected: 7
  },
  {
    id: 5,
    name: "Negative values",
    input: "nums = [-1, -2, -3, -4], k = 2",
    nums: [-1, -2, -3, -4],
    k: 2,
    expected: -2
  },
  {
    id: 6,
    name: "k equals length",
    input: "nums = [2, 1], k = 2",
    nums: [2, 1],
    k: 2,
    expected: 1
  }
];
