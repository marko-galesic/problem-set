// Island Perimeter test suite
//
// Test cases for islandPerimeter method

export const runTests = [
  {
    "id": 1,
    "name": "Example island",
    "input": "grid = [[0,1,0,0],[1,1,1,0],[0,1,0,0],[1,1,0,0]]",
    "grid": [
      [
        0,
        1,
        0,
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
      ],
      [
        1,
        1,
        0,
        0
      ]
    ],
    "expected": 16
  },
  {
    "id": 2,
    "name": "Single cell",
    "input": "grid = [[1]]",
    "grid": [
      [
        1
      ]
    ],
    "expected": 4
  },
  {
    "id": 3,
    "name": "Single row",
    "input": "grid = [[1, 0]]",
    "grid": [
      [
        1,
        0
      ]
    ],
    "expected": 4
  }
];

export const submitTests = [
  {
    "id": 4,
    "name": "Two cells",
    "input": "grid = [[1, 1]]",
    "grid": [
      [
        1,
        1
      ]
    ],
    "expected": 6
  },
  {
    "id": 5,
    "name": "Square",
    "input": "grid = [[1,1],[1,1]]",
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
    "expected": 8
  },
  {
    "id": 6,
    "name": "All water",
    "input": "grid = [[0,0],[0,0]]",
    "grid": [
      [
        0,
        0
      ],
      [
        0,
        0
      ]
    ],
    "expected": 0
  }
];
