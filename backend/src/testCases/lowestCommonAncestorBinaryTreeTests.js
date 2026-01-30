// Lowest Common Ancestor (Binary Tree) test suite
//
// Test cases for lowestCommonAncestor method

export const runTests = [
  {
    "id": 1,
    "name": "Example",
    "input": "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1",
    "root": [
      3,
      5,
      1,
      6,
      2,
      0,
      8,
      null,
      null,
      7,
      4
    ],
    "p": 5,
    "q": 1,
    "expected": 3
  },
  {
    "id": 2,
    "name": "Ancestor",
    "input": "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4",
    "root": [
      3,
      5,
      1,
      6,
      2,
      0,
      8,
      null,
      null,
      7,
      4
    ],
    "p": 5,
    "q": 4,
    "expected": 5
  },
  {
    "id": 3,
    "name": "Small tree",
    "input": "root = [1,2,3], p = 2, q = 3",
    "root": [
      1,
      2,
      3
    ],
    "p": 2,
    "q": 3,
    "expected": 1
  }
];

export const submitTests = [
  {
    "id": 4,
    "name": "Split",
    "input": "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8",
    "root": [
      6,
      2,
      8,
      0,
      4,
      7,
      9,
      null,
      null,
      3,
      5
    ],
    "p": 2,
    "q": 8,
    "expected": 6
  },
  {
    "id": 5,
    "name": "Ancestor left",
    "input": "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4",
    "root": [
      6,
      2,
      8,
      0,
      4,
      7,
      9,
      null,
      null,
      3,
      5
    ],
    "p": 2,
    "q": 4,
    "expected": 2
  },
  {
    "id": 6,
    "name": "Two nodes",
    "input": "root = [2,1], p = 2, q = 1",
    "root": [
      2,
      1
    ],
    "p": 2,
    "q": 1,
    "expected": 2
  }
];
