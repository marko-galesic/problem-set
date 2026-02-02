// Longest Increasing Subsequence test suite
//
// Test cases for lengthOfLIS(nums) method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Classic example",
    "input": "nums = [10, 9, 2, 5, 3, 7, 101, 18]",
    "nums": [
      10,
      9,
      2,
      5,
      3,
      7,
      101,
      18
    ],
    "expected": 4
  },
  {
    "id": 2,
    "name": "Mixed values",
    "input": "nums = [0, 1, 0, 3, 2, 3]",
    "nums": [
      0,
      1,
      0,
      3,
      2,
      3
    ],
    "expected": 4
  },
  {
    "id": 3,
    "name": "All equal",
    "input": "nums = [7, 7, 7, 7]",
    "nums": [
      7,
      7,
      7,
      7
    ],
    "expected": 1
  },
  {
    "id": 4,
    "name": "Another sequence",
    "input": "nums = [4, 10, 4, 3, 8, 9]",
    "nums": [
      4,
      10,
      4,
      3,
      8,
      9
    ],
    "expected": 3
  }
];

export const submitTests = [
  ...runTests
];
