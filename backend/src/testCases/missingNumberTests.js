// Missing Number test suite
//
// Test cases for missingNumber method

export const runTests = [
  {
    "id": 1,
    "name": "Missing middle",
    "input": "nums = [3, 0, 1]",
    "nums": [
      3,
      0,
      1
    ],
    "expected": 2
  },
  {
    "id": 2,
    "name": "Missing end",
    "input": "nums = [0, 1]",
    "nums": [
      0,
      1
    ],
    "expected": 2
  },
  {
    "id": 3,
    "name": "Larger",
    "input": "nums = [9, 6, 4, 2, 3, 5, 7, 0, 1]",
    "nums": [
      9,
      6,
      4,
      2,
      3,
      5,
      7,
      0,
      1
    ],
    "expected": 8
  }
];

export const submitTests = [
  {
    "id": 4,
    "name": "Empty",
    "input": "nums = []",
    "nums": [],
    "expected": 0
  },
  {
    "id": 5,
    "name": "Single",
    "input": "nums = [0]",
    "nums": [
      0
    ],
    "expected": 1
  },
  {
    "id": 6,
    "name": "Missing zero",
    "input": "nums = [1]",
    "nums": [
      1
    ],
    "expected": 0
  },
  {
    "id": 7,
    "name": "Small",
    "input": "nums = [2, 0]",
    "nums": [
      2,
      0
    ],
    "expected": 1
  }
];
