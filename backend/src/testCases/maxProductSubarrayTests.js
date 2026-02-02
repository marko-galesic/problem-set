// Max Product Subarray test suite
//
// Test cases for maxProductSubarray method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Mixed signs",
    "input": "nums = [2, 3, -2, 4]",
    "nums": [
      2,
      3,
      -2,
      4
    ],
    "expected": 6
  },
  {
    "id": 2,
    "name": "Includes zero",
    "input": "nums = [-2, 0, -1]",
    "nums": [
      -2,
      0,
      -1
    ],
    "expected": 0
  },
  {
    "id": 3,
    "name": "Two negatives",
    "input": "nums = [-2, 3, -4]",
    "nums": [
      -2,
      3,
      -4
    ],
    "expected": 24
  },
  {
    "id": 4,
    "name": "Single positive",
    "input": "nums = [0, 2]",
    "nums": [
      0,
      2
    ],
    "expected": 2
  }
];

export const submitTests = [
  ...runTests
];
