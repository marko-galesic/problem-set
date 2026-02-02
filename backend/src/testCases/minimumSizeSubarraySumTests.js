// Minimum Size Subarray Sum test suite
//
// Test cases for minSubArrayLen(target, nums) method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Classic example",
    "input": "target = 7, nums = [2, 3, 1, 2, 4, 3]",
    "target": 7,
    "nums": [
      2,
      3,
      1,
      2,
      4,
      3
    ],
    "expected": 2
  },
  {
    "id": 2,
    "name": "Single element",
    "input": "target = 4, nums = [1, 4, 4]",
    "target": 4,
    "nums": [
      1,
      4,
      4
    ],
    "expected": 1
  },
  {
    "id": 3,
    "name": "Entire array",
    "input": "target = 11, nums = [1, 2, 3, 4, 5]",
    "target": 11,
    "nums": [
      1,
      2,
      3,
      4,
      5
    ],
    "expected": 3
  },
  {
    "id": 4,
    "name": "No solution",
    "input": "target = 20, nums = [1, 2, 3, 4, 5]",
    "target": 20,
    "nums": [
      1,
      2,
      3,
      4,
      5
    ],
    "expected": 0
  }
];

export const submitTests = [
  ...runTests
];
