// Contiguous Array test suite
//
// Test cases for findMaxLength(nums) method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Two elements",
    "input": "nums = [0, 1]",
    "nums": [
      0,
      1
    ],
    "expected": 2
  },
  {
    "id": 2,
    "name": "Odd length",
    "input": "nums = [0, 1, 0]",
    "nums": [
      0,
      1,
      0
    ],
    "expected": 2
  },
  {
    "id": 3,
    "name": "All balanced",
    "input": "nums = [0, 1, 0, 1]",
    "nums": [
      0,
      1,
      0,
      1
    ],
    "expected": 4
  },
  {
    "id": 4,
    "name": "Longer example",
    "input": "nums = [0, 0, 1, 1, 0]",
    "nums": [
      0,
      0,
      1,
      1,
      0
    ],
    "expected": 4
  }
];

export const submitTests = [
  ...runTests
];
