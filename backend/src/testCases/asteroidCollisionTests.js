// Asteroid Collision test suite
//
// Test cases for asteroidCollision(asteroids) method
// Returns int[]

export const runTests = [
  {
    "id": 1,
    "name": "Right then left",
    "input": "asteroids = [5, 10, -5]",
    "asteroids": [
      5,
      10,
      -5
    ],
    "expected": [
      5,
      10
    ]
  },
  {
    "id": 2,
    "name": "Equal size",
    "input": "asteroids = [8, -8]",
    "asteroids": [
      8,
      -8
    ],
    "expected": []
  },
  {
    "id": 3,
    "name": "Chain collision",
    "input": "asteroids = [10, 2, -5]",
    "asteroids": [
      10,
      2,
      -5
    ],
    "expected": [
      10
    ]
  },
  {
    "id": 4,
    "name": "No collisions",
    "input": "asteroids = [-2, -1, 1, 2]",
    "asteroids": [
      -2,
      -1,
      1,
      2
    ],
    "expected": [
      -2,
      -1,
      1,
      2
    ]
  }
];

export const submitTests = [
  ...runTests
];
