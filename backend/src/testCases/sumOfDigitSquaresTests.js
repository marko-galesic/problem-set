// Sum of Digit Squares test suite
//
// Test cases for sumOfDigitSquares(int n)

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
    "name": "Positive number",
    "input": "n = 123",
    "n": 123,
    "expected": 14
  },
  {
    "id": 3,
    "name": "Negative number",
    "input": "n = -405",
    "n": -405,
    "expected": 41
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "Three nines",
      "input": "n = 999",
      "n": 999,
      "expected": 243
    },
    {
      "id": 5,
      "name": "Ends with zero",
      "input": "n = 10",
      "n": 10,
      "expected": 1
    }
];
