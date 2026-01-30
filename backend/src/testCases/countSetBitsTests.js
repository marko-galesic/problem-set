// Count Set Bits test suite
//
// Test cases for countSetBits(int n)

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
    "name": "Small number",
    "input": "n = 5",
    "n": 5,
    "expected": 2
  },
  {
    "id": 3,
    "name": "All ones",
    "input": "n = 31",
    "n": 31,
    "expected": 5
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "Large all ones",
      "input": "n = 1023",
      "n": 1023,
      "expected": 10
    },
    {
      "id": 5,
      "name": "Power of two",
      "input": "n = 8",
      "n": 8,
      "expected": 1
    }
];
