// Auto-generated test suite

export const runTests = [
  {
    "id": 1,
    "name": "Example",
    "input": "grid = [[3, 2, 1], [1, 7, 6], [2, 7, 7]]",
    "grid": [
      [
        3,
        2,
        1
      ],
      [
        1,
        7,
        6
      ],
      [
        2,
        7,
        7
      ]
    ],
    "expected": 1
  },
  {
    "id": 2,
    "name": "Symmetric 2x2",
    "input": "grid = [[1, 2], [2, 1]]",
    "grid": [
      [
        1,
        2
      ],
      [
        2,
        1
      ]
    ],
    "expected": 2
  },
  {
    "id": 3,
    "name": "All same",
    "input": "grid = [[1, 1, 1], [1, 1, 1], [1, 1, 1]]",
    "grid": [
      [
        1,
        1,
        1
      ],
      [
        1,
        1,
        1
      ],
      [
        1,
        1,
        1
      ]
    ],
    "expected": 9
  }
];

export const submitTests = [
  {
    "id": 1,
    "name": "Example",
    "input": "grid = [[3, 2, 1], [1, 7, 6], [2, 7, 7]]",
    "grid": [
      [
        3,
        2,
        1
      ],
      [
        1,
        7,
        6
      ],
      [
        2,
        7,
        7
      ]
    ],
    "expected": 1
  },
  {
    "id": 2,
    "name": "Symmetric 2x2",
    "input": "grid = [[1, 2], [2, 1]]",
    "grid": [
      [
        1,
        2
      ],
      [
        2,
        1
      ]
    ],
    "expected": 2
  },
  {
    "id": 3,
    "name": "All same",
    "input": "grid = [[1, 1, 1], [1, 1, 1], [1, 1, 1]]",
    "grid": [
      [
        1,
        1,
        1
      ],
      [
        1,
        1,
        1
      ],
      [
        1,
        1,
        1
      ]
    ],
    "expected": 9
  },
  {
    "id": 4,
    "name": "No matches",
    "input": "grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]",
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
      ],
      [
        7,
        8,
        9
      ]
    ],
    "expected": 0
  },
  {
    "id": 5,
    "name": "Single cell",
    "input": "grid = [[2]]",
    "grid": [
      [
        2
      ]
    ],
    "expected": 1
  },
  {
    "id": 6,
    "name": "Patterned",
    "input": "grid = [[1, 2, 1], [2, 1, 2], [1, 2, 1]]",
    "grid": [
      [
        1,
        2,
        1
      ],
      [
        2,
        1,
        2
      ],
      [
        1,
        2,
        1
      ]
    ],
    "expected": 5
  }
];
