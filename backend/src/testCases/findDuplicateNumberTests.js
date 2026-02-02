// Find Duplicate Number test suite
//
// Test cases for findDuplicate(nums) method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Duplicate in middle",
    "input": "nums = [1, 3, 4, 2, 2]",
    "nums": [
      1,
      3,
      4,
      2,
      2
    ],
    "expected": 2
  },
  {
    "id": 2,
    "name": "Duplicate at start",
    "input": "nums = [3, 1, 3, 4, 2]",
    "nums": [
      3,
      1,
      3,
      4,
      2
    ],
    "expected": 3
  },
  {
    "id": 3,
    "name": "Smallest array",
    "input": "nums = [1, 1]",
    "nums": [
      1,
      1
    ],
    "expected": 1
  },
  {
    "id": 4,
    "name": "Larger sample",
    "input": "nums = [1, 4, 6, 2, 6, 3, 5]",
    "nums": [
      1,
      4,
      6,
      2,
      6,
      3,
      5
    ],
    "expected": 6
  }
];

export const submitTests = [
  ...runTests
];
