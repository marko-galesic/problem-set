// Kth Smallest in Sorted Matrix test suite
//
// Test cases for kthSmallest(matrix, k) method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Standard matrix",
    "input": "matrix = [[1, 5, 9], [10, 11, 13], [12, 13, 15]], k = 8",
    "matrix": [
      [
        1,
        5,
        9
      ],
      [
        10,
        11,
        13
      ],
      [
        12,
        13,
        15
      ]
    ],
    "k": 8,
    "expected": 13
  },
  {
    "id": 2,
    "name": "Single element",
    "input": "matrix = [[-5]], k = 1",
    "matrix": [
      [
        -5
      ]
    ],
    "k": 1,
    "expected": -5
  },
  {
    "id": 3,
    "name": "Duplicates",
    "input": "matrix = [[1, 2], [1, 3]], k = 2",
    "matrix": [
      [
        1,
        2
      ],
      [
        1,
        3
      ]
    ],
    "k": 2,
    "expected": 1
  },
  {
    "id": 4,
    "name": "Another k",
    "input": "matrix = [[1, 2], [1, 3]], k = 3",
    "matrix": [
      [
        1,
        2
      ],
      [
        1,
        3
      ]
    ],
    "k": 3,
    "expected": 2
  }
];

export const submitTests = [
  ...runTests
];
