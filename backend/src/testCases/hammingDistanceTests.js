// Hamming Distance test suite
//
// Test cases for hammingDistance method

export const runTests = [
  {
    "id": 1,
    "name": "Example",
    "input": "x = 1, y = 4",
    "x": 1,
    "y": 4,
    "expected": 2
  },
  {
    "id": 2,
    "name": "Small",
    "input": "x = 3, y = 1",
    "x": 3,
    "y": 1,
    "expected": 1
  },
  {
    "id": 3,
    "name": "Zero",
    "input": "x = 0, y = 0",
    "x": 0,
    "y": 0,
    "expected": 0
  }
];

export const submitTests = [
  {
    "id": 4,
    "name": "All ones",
    "input": "x = 255, y = 0",
    "x": 255,
    "y": 0,
    "expected": 8
  },
  {
    "id": 5,
    "name": "Close values",
    "input": "x = 31, y = 14",
    "x": 31,
    "y": 14,
    "expected": 2
  },
  {
    "id": 6,
    "name": "Another",
    "input": "x = 9, y = 14",
    "x": 9,
    "y": 14,
    "expected": 3
  }
];
