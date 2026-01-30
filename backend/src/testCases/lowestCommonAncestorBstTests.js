// Lowest Common Ancestor BST test suite
//
// Test cases for lowestCommonAncestorBst(TreeNode root, int p, int q)

export const runTests = [
  {
    "id": 1,
    "name": "Different sides",
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
    "id": 2,
    "name": "Ancestor is p",
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
    "id": 3,
    "name": "Right subtree",
    "input": "root = [5,3,8,2,4,6,10], p = 6, q = 10",
    "root": [
      5,
      3,
      8,
      2,
      4,
      6,
      10
    ],
    "p": 6,
    "q": 10,
    "expected": 8
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "Small tree",
      "input": "root = [2,1,3], p = 1, q = 3",
      "root": [
        2,
        1,
        3
      ],
      "p": 1,
      "q": 3,
      "expected": 2
    },
    {
      "id": 5,
      "name": "Balanced",
      "input": "root = [10,5,15,3,7,12,18], p = 3, q = 7",
      "root": [
        10,
        5,
        15,
        3,
        7,
        12,
        18
      ],
      "p": 3,
      "q": 7,
      "expected": 5
    }
];
