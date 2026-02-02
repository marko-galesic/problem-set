// Subarray Product Less Than K test suite
//
// Test cases for numSubarrayProductLessThanK(nums, k) method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Classic example",
    "input": "nums = [10, 5, 2, 6], k = 100",
    "nums": [
      10,
      5,
      2,
      6
    ],
    "k": 100,
    "expected": 8
  },
  {
    "id": 2,
    "name": "Zero or one k",
    "input": "nums = [1, 2, 3], k = 0",
    "nums": [
      1,
      2,
      3
    ],
    "k": 0,
    "expected": 0
  },
  {
    "id": 3,
    "name": "All products valid",
    "input": "nums = [1, 1, 1], k = 2",
    "nums": [
      1,
      1,
      1
    ],
    "k": 2,
    "expected": 6
  },
  {
    "id": 4,
    "name": "Mixed products",
    "input": "nums = [3, 4, 7], k = 50",
    "nums": [
      3,
      4,
      7
    ],
    "k": 50,
    "expected": 5
  }
];

export const submitTests = [
  ...runTests
];
