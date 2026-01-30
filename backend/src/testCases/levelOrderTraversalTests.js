// Level Order Traversal test suite
//
// Test cases for levelOrderTraversal(TreeNode root)

export const runTests = [
  {
    "id": 1,
    "name": "Example",
    "input": "root = [3,9,20,null,null,15,7]",
    "root": [
      3,
      9,
      20,
      null,
      null,
      15,
      7
    ],
    "expected": [
      [
        3
      ],
      [
        9,
        20
      ],
      [
        15,
        7
      ]
    ]
  },
  {
    "id": 2,
    "name": "Empty tree",
    "input": "root = []",
    "root": [],
    "expected": []
  },
  {
    "id": 3,
    "name": "Single node",
    "input": "root = [1]",
    "root": [
      1
    ],
    "expected": [
      [
        1
      ]
    ]
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "Uneven",
      "input": "root = [1,2,3,4,5,null,7]",
      "root": [
        1,
        2,
        3,
        4,
        5,
        null,
        7
      ],
      "expected": [
        [
          1
        ],
        [
          2,
          3
        ],
        [
          4,
          5,
          7
        ]
      ]
    },
    {
      "id": 5,
      "name": "Another",
      "input": "root = [10,5,15,null,7,12,18]",
      "root": [
        10,
        5,
        15,
        null,
        7,
        12,
        18
      ],
      "expected": [
        [
          10
        ],
        [
          5,
          15
        ],
        [
          7,
          12,
          18
        ]
      ]
    }
];
