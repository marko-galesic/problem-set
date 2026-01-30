// Reverse Bits test suite
//
// Test cases for reverseBits method

export const runTests = [
  {
    "id": 1,
    "name": "Example",
    "input": "n = 43261596",
    "n": 43261596,
    "expected": 964176192
  },
  {
    "id": 2,
    "name": "Zero",
    "input": "n = 0",
    "n": 0,
    "expected": 0
  },
  {
    "id": 3,
    "name": "Two",
    "input": "n = 2",
    "n": 2,
    "expected": 1073741824
  }
];

export const submitTests = [
  {
    "id": 4,
    "name": "Eight",
    "input": "n = 8",
    "n": 8,
    "expected": 268435456
  },
  {
    "id": 5,
    "name": "Sixteen",
    "input": "n = 16",
    "n": 16,
    "expected": 134217728
  }
];
