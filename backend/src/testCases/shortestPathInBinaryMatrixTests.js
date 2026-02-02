// Shortest Path in Binary Matrix test suite
//
// Test cases for shortestPathBinaryMatrix(grid) method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Diagonal path",
    "input": "grid = [[0, 1], [1, 0]]",
    "grid": [
      [
        0,
        1
      ],
      [
        1,
        0
      ]
    ],
    "expected": 2
  },
  {
    "id": 2,
    "name": "Longer path",
    "input": "grid = [[0, 0, 0], [1, 1, 0], [1, 1, 0]]",
    "grid": [
      [
        0,
        0,
        0
      ],
      [
        1,
        1,
        0
      ],
      [
        1,
        1,
        0
      ]
    ],
    "expected": 4
  },
  {
    "id": 3,
    "name": "Blocked start",
    "input": "grid = [[1, 0], [0, 0]]",
    "grid": [
      [
        1,
        0
      ],
      [
        0,
        0
      ]
    ],
    "expected": -1
  },
  {
    "id": 4,
    "name": "Single open cell",
    "input": "grid = [[0]]",
    "grid": [
      [
        0
      ]
    ],
    "expected": 1
  }
];

export const submitTests = [
  ...runTests
];
