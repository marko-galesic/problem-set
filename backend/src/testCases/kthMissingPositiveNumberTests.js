// Kth Missing Positive Number test suite
//
// Test cases for kthMissingPositiveNumber method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Classic example",
    "input": "arr = [2, 3, 4, 7, 11], k = 5",
    "arr": [
      2,
      3,
      4,
      7,
      11
    ],
    "k": 5,
    "expected": 9
  },
  {
    "id": 2,
    "name": "Missing after end",
    "input": "arr = [1, 2, 3, 4], k = 2",
    "arr": [
      1,
      2,
      3,
      4
    ],
    "k": 2,
    "expected": 6
  },
  {
    "id": 3,
    "name": "Missing before start",
    "input": "arr = [5, 6, 7], k = 1",
    "arr": [
      5,
      6,
      7
    ],
    "k": 1,
    "expected": 1
  }
];

export const submitTests = [
  ...runTests
];
