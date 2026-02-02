// Remove Duplicates Allow Two test suite
//
// Test cases for removeDuplicatesAllowTwo method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Basic duplicates",
    "input": "nums = [1, 1, 1, 2, 2, 3]",
    "nums": [
      1,
      1,
      1,
      2,
      2,
      3
    ],
    "expected": 5
  },
  {
    "id": 2,
    "name": "Many repeats",
    "input": "nums = [0, 0, 1, 1, 1, 1, 2, 3, 3]",
    "nums": [
      0,
      0,
      1,
      1,
      1,
      1,
      2,
      3,
      3
    ],
    "expected": 7
  },
  {
    "id": 3,
    "name": "No duplicates",
    "input": "nums = [1, 2, 3]",
    "nums": [
      1,
      2,
      3
    ],
    "expected": 3
  }
];

export const submitTests = [
  ...runTests
];
