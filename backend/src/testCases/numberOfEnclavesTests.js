// Auto-generated test suite

export const runTests = [
  {
    "id": 1,
    "name": "Example",
    "input": "grid = [[0, 0, 0, 0], [1, 0, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]]",
    "grid": [
      [
        0,
        0,
        0,
        0
      ],
      [
        1,
        0,
        1,
        0
      ],
      [
        0,
        1,
        1,
        0
      ],
      [
        0,
        0,
        0,
        0
      ]
    ],
    "expected": 3
  },
  {
    "id": 2,
    "name": "All reachable",
    "input": "grid = [[0, 1, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0]]",
    "grid": [
      [
        0,
        1,
        1,
        0
      ],
      [
        0,
        0,
        1,
        0
      ],
      [
        0,
        0,
        1,
        0
      ],
      [
        0,
        0,
        0,
        0
      ]
    ],
    "expected": 0
  },
  {
    "id": 3,
    "name": "Boundary land",
    "input": "grid = [[1, 1, 1], [1, 0, 1], [1, 1, 1]]",
    "grid": [
      [
        1,
        1,
        1
      ],
      [
        1,
        0,
        1
      ],
      [
        1,
        1,
        1
      ]
    ],
    "expected": 0
  }
];

export const submitTests = [
  {
    "id": 1,
    "name": "Example",
    "input": "grid = [[0, 0, 0, 0], [1, 0, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]]",
    "grid": [
      [
        0,
        0,
        0,
        0
      ],
      [
        1,
        0,
        1,
        0
      ],
      [
        0,
        1,
        1,
        0
      ],
      [
        0,
        0,
        0,
        0
      ]
    ],
    "expected": 3
  },
  {
    "id": 2,
    "name": "All reachable",
    "input": "grid = [[0, 1, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0]]",
    "grid": [
      [
        0,
        1,
        1,
        0
      ],
      [
        0,
        0,
        1,
        0
      ],
      [
        0,
        0,
        1,
        0
      ],
      [
        0,
        0,
        0,
        0
      ]
    ],
    "expected": 0
  },
  {
    "id": 3,
    "name": "Boundary land",
    "input": "grid = [[1, 1, 1], [1, 0, 1], [1, 1, 1]]",
    "grid": [
      [
        1,
        1,
        1
      ],
      [
        1,
        0,
        1
      ],
      [
        1,
        1,
        1
      ]
    ],
    "expected": 0
  },
  {
    "id": 4,
    "name": "Single enclave",
    "input": "grid = [[0, 0, 0], [0, 1, 0], [0, 0, 0]]",
    "grid": [
      [
        0,
        0,
        0
      ],
      [
        0,
        1,
        0
      ],
      [
        0,
        0,
        0
      ]
    ],
    "expected": 1
  },
  {
    "id": 5,
    "name": "Center enclave",
    "input": "grid = [[1, 0, 1], [0, 1, 0], [1, 0, 1]]",
    "grid": [
      [
        1,
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
        1
      ]
    ],
    "expected": 1
  },
  {
    "id": 6,
    "name": "All land",
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
    "expected": 0
  }
];
