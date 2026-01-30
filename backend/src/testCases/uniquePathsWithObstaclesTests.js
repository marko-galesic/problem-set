// Unique Paths with Obstacles test suite
//
// Test cases for uniquePathsWithObstacles(int[][] grid)

export const runTests = [
  {
    "id": 1,
    "name": "Example",
    "input": "grid = [[0,0,0],[0,1,0],[0,0,0]]",
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
    "expected": 2
  },
  {
    "id": 2,
    "name": "Small",
    "input": "grid = [[0,1],[0,0]]",
    "grid": [
      [
        0,
        1
      ],
      [
        0,
        0
      ]
    ],
    "expected": 1
  },
  {
    "id": 3,
    "name": "Blocked start",
    "input": "grid = [[1]]",
    "grid": [
      [
        1
      ]
    ],
    "expected": 0
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "Single open",
      "input": "grid = [[0]]",
      "grid": [
        [
          0
        ]
      ],
      "expected": 1
    },
    {
      "id": 5,
      "name": "Obstacle in first column",
      "input": "grid = [[0,0],[1,0]]",
      "grid": [
        [
          0,
          0
        ],
        [
          1,
          0
        ]
      ],
      "expected": 1
    }
];
