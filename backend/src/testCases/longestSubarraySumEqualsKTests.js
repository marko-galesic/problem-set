// Longest Subarray Sum Equals K test suite
//
// Test cases for longestSubarraySumEqualsK method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Mixed positives and negatives",
    "input": "nums = [1, -1, 5, -2, 3], k = 3",
    "nums": [
      1,
      -1,
      5,
      -2,
      3
    ],
    "k": 3,
    "expected": 4
  },
  {
    "id": 2,
    "name": "Simple case",
    "input": "nums = [1, 2, 3], k = 3",
    "nums": [
      1,
      2,
      3
    ],
    "k": 3,
    "expected": 2
  },
  {
    "id": 3,
    "name": "Whole array matches",
    "input": "nums = [-1, -1, 1, 1, 1], k = 1",
    "nums": [
      -1,
      -1,
      1,
      1,
      1
    ],
    "k": 1,
    "expected": 5
  }
];

export const submitTests = [
  ...runTests
];
