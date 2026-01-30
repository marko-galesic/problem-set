// Diameter Of Binary Tree test suite
//
// Test cases for diameterOfBinaryTree method

export const runTests = [
  {
    "id": 1,
    "name": "Example",
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
    "id": 2,
    "name": "Two nodes",
    "input": "root = [1, 2]",
    "root": [
      1,
      2
    ],
    "expected": 1
  },
  {
    "id": 3,
    "name": "Single node",
    "input": "root = [1]",
    "root": [
      1
    ],
    "expected": 0
  }
];

export const submitTests = [
  {
    "id": 4,
    "name": "Perfect tree",
    "input": "root = [1,2,3,4,5,6,7]",
    "root": [
      1,
      2,
      3,
      4,
      5,
      6,
      7
    ],
    "expected": 4
  },
  {
    "id": 5,
    "name": "Left chain",
    "input": "root = [1,2,null,3,null,4]",
    "root": [
      1,
      2,
      null,
      3,
      null,
      4
    ],
    "expected": 3
  },
  {
    "id": 6,
    "name": "Empty",
    "input": "root = []",
    "root": null,
    "expected": 0
  }
];
