// Range Sum Query (Immutable) test suite
//
// Test cases for rangeSum method

export const runTests = [
  {
    "id": 1,
    "name": "Simple",
    "input": "nums = [1, 2, 3, 4, 5], left = 1, right = 3",
    "nums": [
      1,
      2,
      3,
      4,
      5
    ],
    "left": 1,
    "right": 3,
    "expected": 9
  },
  {
    "id": 2,
    "name": "Negative values",
    "input": "nums = [-2, 0, 3, -5, 2, -1], left = 0, right = 2",
    "nums": [
      -2,
      0,
      3,
      -5,
      2,
      -1
    ],
    "left": 0,
    "right": 2,
    "expected": 1
  },
  {
    "id": 3,
    "name": "Tail range",
    "input": "nums = [-2, 0, 3, -5, 2, -1], left = 2, right = 5",
    "nums": [
      -2,
      0,
      3,
      -5,
      2,
      -1
    ],
    "left": 2,
    "right": 5,
    "expected": -1
  }
];

export const submitTests = [
  {
    "id": 4,
    "name": "Full range",
    "input": "nums = [-2, 0, 3, -5, 2, -1], left = 0, right = 5",
    "nums": [
      -2,
      0,
      3,
      -5,
      2,
      -1
    ],
    "left": 0,
    "right": 5,
    "expected": -3
  },
  {
    "id": 5,
    "name": "Single element",
    "input": "nums = [5], left = 0, right = 0",
    "nums": [
      5
    ],
    "left": 0,
    "right": 0,
    "expected": 5
  },
  {
    "id": 6,
    "name": "Whole list",
    "input": "nums = [1, 2, 3, 4, 5], left = 0, right = 4",
    "nums": [
      1,
      2,
      3,
      4,
      5
    ],
    "left": 0,
    "right": 4,
    "expected": 15
  }
];
