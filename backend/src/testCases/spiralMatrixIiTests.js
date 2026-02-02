// Spiral Matrix II test suite
//
// Test cases for generateMatrix(n) method
// Returns int[][]

export const runTests = [
  {
    "id": 1,
    "name": "Single cell",
    "input": "n = 1",
    "n": 1,
    "expected": [
      [
        1
      ]
    ]
  },
  {
    "id": 2,
    "name": "Two by two",
    "input": "n = 2",
    "n": 2,
    "expected": [
      [
        1,
        2
      ],
      [
        4,
        3
      ]
    ]
  },
  {
    "id": 3,
    "name": "Three by three",
    "input": "n = 3",
    "n": 3,
    "expected": [
      [
        1,
        2,
        3
      ],
      [
        8,
        9,
        4
      ],
      [
        7,
        6,
        5
      ]
    ]
  },
  {
    "id": 4,
    "name": "Four by four",
    "input": "n = 4",
    "n": 4,
    "expected": [
      [
        1,
        2,
        3,
        4
      ],
      [
        12,
        13,
        14,
        5
      ],
      [
        11,
        16,
        15,
        6
      ],
      [
        10,
        9,
        8,
        7
      ]
    ]
  }
];

export const submitTests = [
  ...runTests
];
