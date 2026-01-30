// Binary Tree Inorder Traversal test suite
//
// Test cases for inorderTraversal method

export const runTests = [
  {
    "id": 1,
    "name": "Example",
    "input": "root = [1, null, 2, 3]",
    "root": [
      1,
      null,
      2,
      3
    ],
    "expected": [
      1,
      3,
      2
    ]
  },
  {
    "id": 2,
    "name": "Balanced",
    "input": "root = [2, 1, 3]",
    "root": [
      2,
      1,
      3
    ],
    "expected": [
      1,
      2,
      3
    ]
  },
  {
    "id": 3,
    "name": "Empty",
    "input": "root = []",
    "root": null,
    "expected": []
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
    "expected": [
      1
    ]
  },
  {
    "id": 5,
    "name": "Perfect tree",
    "input": "root = [4,2,6,1,3,5,7]",
    "root": [
      4,
      2,
      6,
      1,
      3,
      5,
      7
    ],
    "expected": [
      1,
      2,
      3,
      4,
      5,
      6,
      7
    ]
  },
  {
    "id": 6,
    "name": "Left chain",
    "input": "root = [1, 2, null, 3]",
    "root": [
      1,
      2,
      null,
      3
    ],
    "expected": [
      3,
      2,
      1
    ]
  }
];
