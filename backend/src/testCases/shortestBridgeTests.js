// Auto-generated test suite

export const runTests = [
  {
    "id": 1,
    "name": "Two cells",
    "input": "grid = [[0, 1], [1, 0]]",
    "grid": [
      [
        0,
        1
      ],
      [
        1,
        0
      ]
    ],
    "expected": 1
  },
  {
    "id": 2,
    "name": "Separated islands",
    "input": "grid = [[0, 1, 0], [0, 0, 0], [0, 0, 1]]",
    "grid": [
      [
        0,
        1,
        0
      ],
      [
        0,
        0,
        0
      ],
      [
        0,
        0,
        1
      ]
    ],
    "expected": 2
  },
  {
    "id": 3,
    "name": "Inner island",
    "input": "grid = [[1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 1, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1]]",
    "grid": [
      [
        1,
        1,
        1,
        1,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        1,
        1,
        1,
        1
      ]
    ],
    "expected": 1
  }
];

export const submitTests = [
  {
    "id": 1,
    "name": "Two cells",
    "input": "grid = [[0, 1], [1, 0]]",
    "grid": [
      [
        0,
        1
      ],
      [
        1,
        0
      ]
    ],
    "expected": 1
  },
  {
    "id": 2,
    "name": "Separated islands",
    "input": "grid = [[0, 1, 0], [0, 0, 0], [0, 0, 1]]",
    "grid": [
      [
        0,
        1,
        0
      ],
      [
        0,
        0,
        0
      ],
      [
        0,
        0,
        1
      ]
    ],
    "expected": 2
  },
  {
    "id": 3,
    "name": "Inner island",
    "input": "grid = [[1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 1, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1]]",
    "grid": [
      [
        1,
        1,
        1,
        1,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        1,
        1,
        1,
        1
      ]
    ],
    "expected": 1
  },
  {
    "id": 4,
    "name": "Far corners",
    "input": "grid = [[1, 0, 0], [0, 0, 0], [0, 0, 1]]",
    "grid": [
      [
        1,
        0,
        0
      ],
      [
        0,
        0,
        0
      ],
      [
        0,
        0,
        1
      ]
    ],
    "expected": 3
  },
  {
    "id": 5,
    "name": "Single row",
    "input": "grid = [[1, 0, 0, 0, 1]]",
    "grid": [
      [
        1,
        0,
        0,
        0,
        1
      ]
    ],
    "expected": 3
  },
  {
    "id": 6,
    "name": "Adjacent islands",
    "input": "grid = [[1, 0, 1]]",
    "grid": [
      [
        1,
        0,
        1
      ]
    ],
    "expected": 1
  }
];
