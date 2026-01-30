// Max Depth Of Binary Tree test suite
//
// Test cases for maxDepth method

export const runTests = [
  {
    "id": 1,
    "name": "Example",
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
    "expected": 3
  },
  {
    "id": 2,
    "name": "Skewed",
    "input": "root = [1, null, 2, null, 3]",
    "root": [
      1,
      null,
      2,
      null,
      3
    ],
    "expected": 3
  },
  {
    "id": 3,
    "name": "Empty",
    "input": "root = []",
    "root": null,
    "expected": 0
  }
];

export const submitTests = [
  {
    "id": 4,
    "name": "Single",
    "input": "root = [1]",
    "root": [
      1
    ],
    "expected": 1
  },
  {
    "id": 5,
    "name": "Balanced",
    "input": "root = [1, 2, 3, 4, 5]",
    "root": [
      1,
      2,
      3,
      4,
      5
    ],
    "expected": 3
  },
  {
    "id": 6,
    "name": "Left chain",
    "input": "root = [1, 2, null, 3, null, 4]",
    "root": [
      1,
      2,
      null,
      3,
      null,
      4
    ],
    "expected": 4
  }
];
