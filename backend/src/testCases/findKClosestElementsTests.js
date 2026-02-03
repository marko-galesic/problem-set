// Auto-generated test suite

export const runTests = [
  {
    "id": 1,
    "name": "Middle target",
    "input": "arr = [1, 2, 3, 4, 5], k = 4, x = 3",
    "arr": [
      1,
      2,
      3,
      4,
      5
    ],
    "k": 4,
    "x": 3,
    "expected": [
      1,
      2,
      3,
      4
    ]
  },
  {
    "id": 2,
    "name": "Target left of array",
    "input": "arr = [1, 2, 3, 4, 5], k = 4, x = -1",
    "arr": [
      1,
      2,
      3,
      4,
      5
    ],
    "k": 4,
    "x": -1,
    "expected": [
      1,
      2,
      3,
      4
    ]
  },
  {
    "id": 3,
    "name": "Target right of array",
    "input": "arr = [1, 2, 3, 4, 5], k = 4, x = 10",
    "arr": [
      1,
      2,
      3,
      4,
      5
    ],
    "k": 4,
    "x": 10,
    "expected": [
      2,
      3,
      4,
      5
    ]
  }
];

export const submitTests = [
  {
    "id": 1,
    "name": "Middle target",
    "input": "arr = [1, 2, 3, 4, 5], k = 4, x = 3",
    "arr": [
      1,
      2,
      3,
      4,
      5
    ],
    "k": 4,
    "x": 3,
    "expected": [
      1,
      2,
      3,
      4
    ]
  },
  {
    "id": 2,
    "name": "Target left of array",
    "input": "arr = [1, 2, 3, 4, 5], k = 4, x = -1",
    "arr": [
      1,
      2,
      3,
      4,
      5
    ],
    "k": 4,
    "x": -1,
    "expected": [
      1,
      2,
      3,
      4
    ]
  },
  {
    "id": 3,
    "name": "Target right of array",
    "input": "arr = [1, 2, 3, 4, 5], k = 4, x = 10",
    "arr": [
      1,
      2,
      3,
      4,
      5
    ],
    "k": 4,
    "x": 10,
    "expected": [
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 4,
    "name": "Duplicates",
    "input": "arr = [1, 1, 1, 10, 10, 10], k = 1, x = 9",
    "arr": [
      1,
      1,
      1,
      10,
      10,
      10
    ],
    "k": 1,
    "x": 9,
    "expected": [
      10
    ]
  },
  {
    "id": 5,
    "name": "Exact match",
    "input": "arr = [0, 1, 2, 3, 4, 5], k = 3, x = 2",
    "arr": [
      0,
      1,
      2,
      3,
      4,
      5
    ],
    "k": 3,
    "x": 2,
    "expected": [
      1,
      2,
      3
    ]
  },
  {
    "id": 6,
    "name": "Negative and positive",
    "input": "arr = [-2, -1, 1, 2, 3], k = 2, x = 0",
    "arr": [
      -2,
      -1,
      1,
      2,
      3
    ],
    "k": 2,
    "x": 0,
    "expected": [
      -1,
      1
    ]
  }
];
