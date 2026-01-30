// Min Steps to Zero test suite
//
// Test cases for minStepsToZero(int n)

export const runTests = [
  {
    "id": 1,
    "name": "Zero",
    "input": "n = 0",
    "n": 0,
    "expected": 0
  },
  {
    "id": 2,
    "name": "Even",
    "input": "n = 8",
    "n": 8,
    "expected": 4
  },
  {
    "id": 3,
    "name": "Odd",
    "input": "n = 7",
    "n": 7,
    "expected": 5
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "One",
      "input": "n = 1",
      "n": 1,
      "expected": 1
    },
    {
      "id": 5,
      "name": "Another",
      "input": "n = 14",
      "n": 14,
      "expected": 6
    }
];
