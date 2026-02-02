// K Closest Points to Origin test suite
//
// Test cases for kClosest(points, k) method
// Returns int[][]

export const runTests = [
  {
    "id": 1,
    "name": "Single closest",
    "input": "points = [[1, 3], [-2, 2]], k = 1",
    "points": [
      [
        1,
        3
      ],
      [
        -2,
        2
      ]
    ],
    "k": 1,
    "expected": [
      [
        -2,
        2
      ]
    ]
  },
  {
    "id": 2,
    "name": "Two closest",
    "input": "points = [[3, 3], [5, -1], [-2, 4]], k = 2",
    "points": [
      [
        3,
        3
      ],
      [
        5,
        -1
      ],
      [
        -2,
        4
      ]
    ],
    "k": 2,
    "expected": [
      [
        3,
        3
      ],
      [
        -2,
        4
      ]
    ]
  },
  {
    "id": 3,
    "name": "Ties by distance",
    "input": "points = [[0, 1], [1, 0], [-1, 0], [0, -1]], k = 2",
    "points": [
      [
        0,
        1
      ],
      [
        1,
        0
      ],
      [
        -1,
        0
      ],
      [
        0,
        -1
      ]
    ],
    "k": 2,
    "expected": [
      [
        -1,
        0
      ],
      [
        0,
        -1
      ]
    ]
  },
  {
    "id": 4,
    "name": "Duplicate points",
    "input": "points = [[2, 2], [2, 2], [3, 3]], k = 2",
    "points": [
      [
        2,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        3
      ]
    ],
    "k": 2,
    "expected": [
      [
        2,
        2
      ],
      [
        2,
        2
      ]
    ]
  }
];

export const submitTests = [
  ...runTests
];
