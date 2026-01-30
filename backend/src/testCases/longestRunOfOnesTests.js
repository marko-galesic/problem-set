// Longest Run of Ones test suite
//
// Test cases for longestRunOfOnes(int n)

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
    "name": "Three ones",
    "input": "n = 14",
    "n": 14,
    "expected": 3
  },
  {
    "id": 3,
    "name": "Separated",
    "input": "n = 29",
    "n": 29,
    "expected": 3
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "All ones",
      "input": "n = 15",
      "n": 15,
      "expected": 4
    },
    {
      "id": 5,
      "name": "Single ones",
      "input": "n = 9",
      "n": 9,
      "expected": 1
    }
];
