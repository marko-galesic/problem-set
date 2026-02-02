// Max Area of Island test suite
//
// Test cases for maxAreaOfIsland method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Clustered island",
    "input": "grid = [[0, 0, 1, 0], [1, 1, 1, 0], [0, 1, 0, 0]]",
    "grid": [
      [
        0,
        0,
        1,
        0
      ],
      [
        1,
        1,
        1,
        0
      ],
      [
        0,
        1,
        0,
        0
      ]
    ],
    "expected": 5
  },
  {
    "id": 2,
    "name": "No land",
    "input": "grid = [[0, 0, 0], [0, 0, 0]]",
    "grid": [
      [
        0,
        0,
        0
      ],
      [
        0,
        0,
        0
      ]
    ],
    "expected": 0
  },
  {
    "id": 3,
    "name": "Full land",
    "input": "grid = [[1, 1], [1, 1]]",
    "grid": [
      [
        1,
        1
      ],
      [
        1,
        1
      ]
    ],
    "expected": 4
  }
];

export const submitTests = [
  ...runTests
];
