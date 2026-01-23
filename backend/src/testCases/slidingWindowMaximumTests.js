// Sliding Window Maximum test suite
//
// Test cases for maxSlidingWindow(int[] nums, int k) method
// Returns int[]: maximum for each window

export const runTests = [
  {
    id: 1,
    name: "Basic example",
    input: "nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3",
    nums: [1, 3, -1, -3, 5, 3, 6, 7],
    k: 3,
    expected: [3, 3, 5, 5, 6, 7]
  },
  {
    id: 2,
    name: "K equals 1",
    input: "nums = [4, 2, 12], k = 1",
    nums: [4, 2, 12],
    k: 1,
    expected: [4, 2, 12]
  },
  {
    id: 3,
    name: "K equals array length",
    input: "nums = [2, 1, 2, 0, 4], k = 5",
    nums: [2, 1, 2, 0, 4],
    k: 5,
    expected: [4]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "All equal values",
    input: "nums = [9, 9, 9, 9], k = 2",
    nums: [9, 9, 9, 9],
    k: 2,
    expected: [9, 9, 9]
  },
  {
    id: 5,
    name: "Decreasing sequence",
    input: "nums = [5, 4, 3, 2, 1], k = 2",
    nums: [5, 4, 3, 2, 1],
    k: 2,
    expected: [5, 4, 3, 2]
  },
  {
    id: 6,
    name: "Mixed negatives and positives",
    input: "nums = [-7, -8, 7, 5, 7, 1, 6, 0], k = 3",
    nums: [-7, -8, 7, 5, 7, 1, 6, 0],
    k: 3,
    expected: [7, 7, 7, 7, 7, 6]
  },
  {
    id: 7,
    name: "Mixed with zeros",
    input: "nums = [1, -1, 0, 2, 3, -2, 5], k = 4",
    nums: [1, -1, 0, 2, 3, -2, 5],
    k: 4,
    expected: [2, 3, 3, 5]
  },
  {
    id: 8,
    name: "Peaks at the end",
    input: "nums = [1, 3, 1, 2, 0, 5], k = 3",
    nums: [1, 3, 1, 2, 0, 5],
    k: 3,
    expected: [3, 3, 2, 5]
  }
];
