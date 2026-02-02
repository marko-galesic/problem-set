// Max Sum of Min Pairs test suite
//
// Test cases for maxSumOfMinPairs method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Small array",
    "input": "nums = [1, 4, 3, 2]",
    "nums": [
      1,
      4,
      3,
      2
    ],
    "expected": 4
  },
  {
    "id": 2,
    "name": "Unsorted values",
    "input": "nums = [6, 2, 6, 5, 1, 2]",
    "nums": [
      6,
      2,
      6,
      5,
      1,
      2
    ],
    "expected": 9
  },
  {
    "id": 3,
    "name": "Includes negatives",
    "input": "nums = [-1, 0, 1, 2]",
    "nums": [
      -1,
      0,
      1,
      2
    ],
    "expected": 0
  }
];

export const submitTests = [
  ...runTests
];
