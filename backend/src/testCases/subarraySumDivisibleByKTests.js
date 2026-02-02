// Subarray Sum Divisible by K test suite
//
// Test cases for subarraySumDivisibleByK method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Classic example",
    "input": "nums = [4, 5, 0, -2, -3, 1], k = 5",
    "nums": [
      4,
      5,
      0,
      -2,
      -3,
      1
    ],
    "k": 5,
    "expected": 7
  },
  {
    "id": 2,
    "name": "Small array",
    "input": "nums = [1, 2, 3], k = 3",
    "nums": [
      1,
      2,
      3
    ],
    "k": 3,
    "expected": 3
  },
  {
    "id": 3,
    "name": "Includes negatives",
    "input": "nums = [-1, 2, 9], k = 2",
    "nums": [
      -1,
      2,
      9
    ],
    "k": 2,
    "expected": 2
  }
];

export const submitTests = [
  ...runTests
];
