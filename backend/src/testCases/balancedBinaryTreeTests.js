// Balanced Binary Tree test suite
//
// Test cases for isBalanced method

export const runTests = [
  {
    "id": 1,
    "name": "Balanced",
    "input": "root = [3, 9, 20, null, null, 15, 7]",
    "root": [
      3,
      9,
      20,
      null,
      null,
      15,
      7
    ],
    "expected": true
  },
  {
    "id": 2,
    "name": "Unbalanced",
    "input": "root = [1, 2, 2, 3, 3, null, null, 4, 4]",
    "root": [
      1,
      2,
      2,
      3,
      3,
      null,
      null,
      4,
      4
    ],
    "expected": false
  },
  {
    "id": 3,
    "name": "Empty",
    "input": "root = []",
    "root": null,
    "expected": true
  }
];

export const submitTests = [
  {
    "id": 4,
    "name": "Small balanced",
    "input": "root = [1, 2, 2]",
    "root": [
      1,
      2,
      2
    ],
    "expected": true
  },
  {
    "id": 5,
    "name": "Left heavy",
    "input": "root = [1, 2, null, 3]",
    "root": [
      1,
      2,
      null,
      3
    ],
    "expected": false
  }
];
