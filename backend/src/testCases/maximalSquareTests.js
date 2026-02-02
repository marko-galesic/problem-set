// Maximal Square test suite
//
// Test cases for maximalSquare(matrix) method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Mixed matrix",
    "input": "matrix = [[\"1\", \"0\", \"1\", \"0\", \"0\"], [\"1\", \"0\", \"1\", \"1\", \"1\"], [\"1\", \"1\", \"1\", \"1\", \"1\"], [\"1\", \"0\", \"0\", \"1\", \"0\"]]",
    "matrix": [
      [
        "1",
        "0",
        "1",
        "0",
        "0"
      ],
      [
        "1",
        "0",
        "1",
        "1",
        "1"
      ],
      [
        "1",
        "1",
        "1",
        "1",
        "1"
      ],
      [
        "1",
        "0",
        "0",
        "1",
        "0"
      ]
    ],
    "expected": 4
  },
  {
    "id": 2,
    "name": "Small matrix",
    "input": "matrix = [[\"0\", \"1\"], [\"1\", \"0\"]]",
    "matrix": [
      [
        "0",
        "1"
      ],
      [
        "1",
        "0"
      ]
    ],
    "expected": 1
  },
  {
    "id": 3,
    "name": "All zeros",
    "input": "matrix = [[\"0\"]]",
    "matrix": [
      [
        "0"
      ]
    ],
    "expected": 0
  },
  {
    "id": 4,
    "name": "All ones",
    "input": "matrix = [[\"1\", \"1\", \"1\"], [\"1\", \"1\", \"1\"], [\"1\", \"1\", \"1\"]]",
    "matrix": [
      [
        "1",
        "1",
        "1"
      ],
      [
        "1",
        "1",
        "1"
      ],
      [
        "1",
        "1",
        "1"
      ]
    ],
    "expected": 9
  }
];

export const submitTests = [
  ...runTests
];
