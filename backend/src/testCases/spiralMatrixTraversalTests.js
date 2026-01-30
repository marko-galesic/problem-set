// Spiral Matrix Traversal test suite
//
// Test cases for spiralMatrixTraversal(int[][] matrix)

export const runTests = [
  {
    "id": 1,
    "name": "3x3",
    "input": "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
    "matrix": [
      [
        1,
        2,
        3
      ],
      [
        4,
        5,
        6
      ],
      [
        7,
        8,
        9
      ]
    ],
    "expected": [
      1,
      2,
      3,
      6,
      9,
      8,
      7,
      4,
      5
    ]
  },
  {
    "id": 2,
    "name": "1x4",
    "input": "matrix = [[1,2,3,4]]",
    "matrix": [
      [
        1,
        2,
        3,
        4
      ]
    ],
    "expected": [
      1,
      2,
      3,
      4
    ]
  },
  {
    "id": 3,
    "name": "3x1",
    "input": "matrix = [[1],[2],[3]]",
    "matrix": [
      [
        1
      ],
      [
        2
      ],
      [
        3
      ]
    ],
    "expected": [
      1,
      2,
      3
    ]
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "2x2",
      "input": "matrix = [[1,2],[3,4]]",
      "matrix": [
        [
          1,
          2
        ],
        [
          3,
          4
        ]
      ],
      "expected": [
        1,
        2,
        4,
        3
      ]
    },
    {
      "id": 5,
      "name": "2x3",
      "input": "matrix = [[1,2,3],[4,5,6]]",
      "matrix": [
        [
          1,
          2,
          3
        ],
        [
          4,
          5,
          6
        ]
      ],
      "expected": [
        1,
        2,
        3,
        6,
        5,
        4
      ]
    }
];
