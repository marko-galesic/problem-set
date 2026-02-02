// Combination Sum III test suite
//
// Test cases for combinationSum3(k, n) method
// Returns int[][]

export const runTests = [
  {
    "id": 1,
    "name": "Single combination",
    "input": "k = 3, n = 7",
    "k": 3,
    "n": 7,
    "expected": [
      [
        1,
        2,
        4
      ]
    ]
  },
  {
    "id": 2,
    "name": "Multiple combinations",
    "input": "k = 3, n = 9",
    "k": 3,
    "n": 9,
    "expected": [
      [
        1,
        2,
        6
      ],
      [
        1,
        3,
        5
      ],
      [
        2,
        3,
        4
      ]
    ]
  },
  {
    "id": 3,
    "name": "No solution",
    "input": "k = 4, n = 1",
    "k": 4,
    "n": 1,
    "expected": []
  },
  {
    "id": 4,
    "name": "Large sum",
    "input": "k = 2, n = 17",
    "k": 2,
    "n": 17,
    "expected": [
      [
        8,
        9
      ]
    ]
  }
];

export const submitTests = [
  ...runTests
];
