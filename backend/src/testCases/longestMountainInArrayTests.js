// Longest Mountain in Array test suite
//
// Test cases for longestMountainInArray method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Mixed terrain",
    "input": "nums = [2, 1, 4, 7, 3, 2, 5]",
    "nums": [
      2,
      1,
      4,
      7,
      3,
      2,
      5
    ],
    "expected": 5
  },
  {
    "id": 2,
    "name": "No mountain",
    "input": "nums = [2, 2, 2]",
    "nums": [
      2,
      2,
      2
    ],
    "expected": 0
  },
  {
    "id": 3,
    "name": "Full mountain",
    "input": "nums = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0]",
    "nums": [
      0,
      1,
      2,
      3,
      4,
      5,
      4,
      3,
      2,
      1,
      0
    ],
    "expected": 11
  }
];

export const submitTests = [
  ...runTests
];
