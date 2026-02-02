// Number of Closed Islands test suite
//
// Test cases for numberOfClosedIslands method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Single closed island",
    "input": "grid = [[1, 1, 1, 1], [1, 0, 0, 1], [1, 0, 0, 1], [1, 1, 1, 1]]",
    "grid": [
      [
        1,
        1,
        1,
        1
      ],
      [
        1,
        0,
        0,
        1
      ],
      [
        1,
        0,
        0,
        1
      ],
      [
        1,
        1,
        1,
        1
      ]
    ],
    "expected": 1
  },
  {
    "id": 2,
    "name": "Border land excluded",
    "input": "grid = [[1, 1, 1, 1], [1, 0, 0, 1], [1, 0, 1, 0], [1, 1, 1, 1]]",
    "grid": [
      [
        1,
        1,
        1,
        1
      ],
      [
        1,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0
      ],
      [
        1,
        1,
        1,
        1
      ]
    ],
    "expected": 1
  },
  {
    "id": 3,
    "name": "No closed island",
    "input": "grid = [[0, 0, 1], [0, 1, 0], [1, 0, 0]]",
    "grid": [
      [
        0,
        0,
        1
      ],
      [
        0,
        1,
        0
      ],
      [
        1,
        0,
        0
      ]
    ],
    "expected": 0
  }
];

export const submitTests = [
  ...runTests
];
