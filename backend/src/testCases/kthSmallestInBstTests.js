// Kth Smallest in BST test suite
//
// Test cases for kthSmallestInBst(TreeNode root, int k)

export const runTests = [
  {
    "id": 1,
    "name": "Basic",
    "input": "root = [3,1,4,null,2], k = 1",
    "root": [
      3,
      1,
      4,
      null,
      2
    ],
    "k": 1,
    "expected": 1
  },
  {
    "id": 2,
    "name": "Larger tree",
    "input": "root = [5,3,6,2,4,null,null,1], k = 3",
    "root": [
      5,
      3,
      6,
      2,
      4,
      null,
      null,
      1
    ],
    "k": 3,
    "expected": 3
  },
  {
    "id": 3,
    "name": "Small tree",
    "input": "root = [2,1,3], k = 2",
    "root": [
      2,
      1,
      3
    ],
    "k": 2,
    "expected": 2
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "Balanced",
      "input": "root = [10,5,15,3,7,12,18], k = 5",
      "root": [
        10,
        5,
        15,
        3,
        7,
        12,
        18
      ],
      "k": 5,
      "expected": 12
    },
    {
      "id": 5,
      "name": "Single",
      "input": "root = [1], k = 1",
      "root": [
        1
      ],
      "k": 1,
      "expected": 1
    }
];
