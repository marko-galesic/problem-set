// Count Subarrays with Even Sum test suite
//
// Test cases for countSubarraysWithEvenSum method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Mixed parity",
    "input": "nums = [1, 2, 3, 4]",
    "nums": [
      1,
      2,
      3,
      4
    ],
    "expected": 4
  },
  {
    "id": 2,
    "name": "All even",
    "input": "nums = [2, 4, 6]",
    "nums": [
      2,
      4,
      6
    ],
    "expected": 6
  },
  {
    "id": 3,
    "name": "All odd",
    "input": "nums = [1, 1, 1]",
    "nums": [
      1,
      1,
      1
    ],
    "expected": 2
  }
];

export const submitTests = [
  ...runTests
];
