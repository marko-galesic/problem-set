// Longest Subarray with At Most K Distinct test suite
//
// Test cases for longestSubarrayAtMostKDistinct method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Two distinct values",
    "input": "nums = [1, 2, 1, 2, 3], k = 2",
    "nums": [
      1,
      2,
      1,
      2,
      3
    ],
    "k": 2,
    "expected": 4
  },
  {
    "id": 2,
    "name": "K equals one",
    "input": "nums = [1, 2, 3, 4, 5], k = 1",
    "nums": [
      1,
      2,
      3,
      4,
      5
    ],
    "k": 1,
    "expected": 1
  },
  {
    "id": 3,
    "name": "All same",
    "input": "nums = [1, 1, 1, 1], k = 1",
    "nums": [
      1,
      1,
      1,
      1
    ],
    "k": 1,
    "expected": 4
  },
  {
    "id": 4,
    "name": "Zero distinct allowed",
    "input": "nums = [1, 2, 3], k = 0",
    "nums": [
      1,
      2,
      3
    ],
    "k": 0,
    "expected": 0
  }
];

export const submitTests = [
  ...runTests
];
