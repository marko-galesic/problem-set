// Unique Paths test suite
//
// Test cases for uniquePaths(m, n) method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Rectangular grid",
    "input": "m = 3, n = 7",
    "m": 3,
    "n": 7,
    "expected": 28
  },
  {
    "id": 2,
    "name": "Small grid",
    "input": "m = 3, n = 2",
    "m": 3,
    "n": 2,
    "expected": 3
  },
  {
    "id": 3,
    "name": "Single cell",
    "input": "m = 1, n = 1",
    "m": 1,
    "n": 1,
    "expected": 1
  },
  {
    "id": 4,
    "name": "Symmetric grid",
    "input": "m = 7, n = 3",
    "m": 7,
    "n": 3,
    "expected": 28
  }
];

export const submitTests = [
  ...runTests
];
