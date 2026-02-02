// Diagonal Traverse test suite
//
// Test cases for diagonalTraverse method
// Returns intArray

export const runTests = [
  {
    "id": 1,
    "name": "3x3 matrix",
    "input": "matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]",
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
      4,
      7,
      5,
      3,
      6,
      8,
      9
    ]
  },
  {
    "id": 2,
    "name": "2x2 matrix",
    "input": "matrix = [[1, 2], [3, 4]]",
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
      3,
      4
    ]
  },
  {
    "id": 3,
    "name": "Single column",
    "input": "matrix = [[1], [2], [3]]",
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
  ...runTests
];
