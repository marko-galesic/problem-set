// Count Battleships test suite
//
// Test cases for countBattleships method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Vertical ship",
    "input": "board = [[\"X\", \".\", \".\", \"X\"], [\".\", \".\", \".\", \"X\"], [\".\", \".\", \".\", \"X\"]]",
    "board": [
      [
        "X",
        ".",
        ".",
        "X"
      ],
      [
        ".",
        ".",
        ".",
        "X"
      ],
      [
        ".",
        ".",
        ".",
        "X"
      ]
    ],
    "expected": 2
  },
  {
    "id": 2,
    "name": "Mixed ships",
    "input": "board = [[\"X\", \"X\", \"X\"], [\".\", \".\", \".\"], [\"X\", \".\", \"X\"]]",
    "board": [
      [
        "X",
        "X",
        "X"
      ],
      [
        ".",
        ".",
        "."
      ],
      [
        "X",
        ".",
        "X"
      ]
    ],
    "expected": 3
  },
  {
    "id": 3,
    "name": "Empty board",
    "input": "board = [[\".\", \".\"], [\".\", \".\"]]",
    "board": [
      [
        ".",
        "."
      ],
      [
        ".",
        "."
      ]
    ],
    "expected": 0
  }
];

export const submitTests = [
  ...runTests
];
