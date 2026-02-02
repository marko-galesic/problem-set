// Matrix Block Sum test suite
//
// Test cases for matrixBlockSum method
// Returns intMatrix

export const runTests = [
  {
    "id": 1,
    "name": "3x3 matrix",
    "input": "mat = [[1, 2, 3], [4, 5, 6], [7, 8, 9]], k = 1",
    "mat": [
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
    "k": 1,
    "expected": [
      [
        12,
        21,
        16
      ],
      [
        27,
        45,
        33
      ],
      [
        24,
        39,
        28
      ]
    ]
  },
  {
    "id": 2,
    "name": "Zero radius",
    "input": "mat = [[1, 2], [3, 4]], k = 0",
    "mat": [
      [
        1,
        2
      ],
      [
        3,
        4
      ]
    ],
    "k": 0,
    "expected": [
      [
        1,
        2
      ],
      [
        3,
        4
      ]
    ]
  },
  {
    "id": 3,
    "name": "Single cell",
    "input": "mat = [[1]], k = 2",
    "mat": [
      [
        1
      ]
    ],
    "k": 2,
    "expected": [
      [
        1
      ]
    ]
  }
];

export const submitTests = [
  ...runTests
];
