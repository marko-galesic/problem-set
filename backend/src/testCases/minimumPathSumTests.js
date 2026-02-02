// Minimum Path Sum test suite
//
// Test cases for minPathSum(grid) method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Classic example",
    "input": "grid = [[1, 3, 1], [1, 5, 1], [4, 2, 1]]",
    "grid": [
      [
        1,
        3,
        1
      ],
      [
        1,
        5,
        1
      ],
      [
        4,
        2,
        1
      ]
    ],
    "expected": 7
  },
  {
    "id": 2,
    "name": "Two rows",
    "input": "grid = [[1, 2, 3], [4, 5, 6]]",
    "grid": [
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
    "expected": 12
  },
  {
    "id": 3,
    "name": "Single cell",
    "input": "grid = [[5]]",
    "grid": [
      [
        5
      ]
    ],
    "expected": 5
  },
  {
    "id": 4,
    "name": "Small square",
    "input": "grid = [[1, 2], [1, 1]]",
    "grid": [
      [
        1,
        2
      ],
      [
        1,
        1
      ]
    ],
    "expected": 3
  }
];

export const submitTests = [
  ...runTests
];
