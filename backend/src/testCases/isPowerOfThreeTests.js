// Is Power of Three test suite
//
// Test cases for isPowerOfThree(int n)

export const runTests = [
  {
    "id": 1,
    "name": "Power of three",
    "input": "n = 27",
    "n": 27,
    "expected": true
  },
  {
    "id": 2,
    "name": "Zero",
    "input": "n = 0",
    "n": 0,
    "expected": false
  },
  {
    "id": 3,
    "name": "Not power",
    "input": "n = 45",
    "n": 45,
    "expected": false
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "One",
      "input": "n = 1",
      "n": 1,
      "expected": true
    },
    {
      "id": 5,
      "name": "Negative",
      "input": "n = -3",
      "n": -3,
      "expected": false
    }
];
