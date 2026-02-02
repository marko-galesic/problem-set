// Subarray Sum Equals K test suite
//
// Test cases for subarraySum(nums, k) method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Simple repeats",
    "input": "nums = [1, 1, 1], k = 2",
    "nums": [
      1,
      1,
      1
    ],
    "k": 2,
    "expected": 2
  },
  {
    "id": 2,
    "name": "Multiple subarrays",
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
    "name": "Includes negative numbers",
    "input": "nums = [-1, -1, 1], k = 0",
    "nums": [
      -1,
      -1,
      1
    ],
    "k": 0,
    "expected": 1
  },
  {
    "id": 4,
    "name": "All zeros",
    "input": "nums = [0, 0, 0], k = 0",
    "nums": [
      0,
      0,
      0
    ],
    "k": 0,
    "expected": 6
  }
];

export const submitTests = [
  ...runTests
];
