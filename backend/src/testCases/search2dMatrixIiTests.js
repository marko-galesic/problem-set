// Search 2D Matrix II test suite
//
// Test cases for searchMatrix(matrix, target) method
// Returns boolean

export const runTests = [
  {
    "id": 1,
    "name": "Target exists",
    "input": "matrix = [[1, 4, 7, 11], [2, 5, 8, 12], [3, 6, 9, 16], [10, 13, 14, 17]], target = 5",
    "matrix": [
      [
        1,
        4,
        7,
        11
      ],
      [
        2,
        5,
        8,
        12
      ],
      [
        3,
        6,
        9,
        16
      ],
      [
        10,
        13,
        14,
        17
      ]
    ],
    "target": 5,
    "expected": true
  },
  {
    "id": 2,
    "name": "Target missing",
    "input": "matrix = [[1, 4, 7, 11], [2, 5, 8, 12], [3, 6, 9, 16], [10, 13, 14, 17]], target = 15",
    "matrix": [
      [
        1,
        4,
        7,
        11
      ],
      [
        2,
        5,
        8,
        12
      ],
      [
        3,
        6,
        9,
        16
      ],
      [
        10,
        13,
        14,
        17
      ]
    ],
    "target": 15,
    "expected": false
  },
  {
    "id": 3,
    "name": "Small matrix",
    "input": "matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]], target = 9",
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
    "target": 9,
    "expected": true
  },
  {
    "id": 4,
    "name": "Single value",
    "input": "matrix = [[-5]], target = -5",
    "matrix": [
      [
        -5
      ]
    ],
    "target": -5,
    "expected": true
  }
];

export const submitTests = [
  ...runTests
];
