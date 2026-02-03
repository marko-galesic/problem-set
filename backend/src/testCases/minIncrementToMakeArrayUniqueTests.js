// Auto-generated test suite

export const runTests = [
  {
    "id": 1,
    "name": "Simple duplicate",
    "input": "nums = [1, 2, 2]",
    "nums": [
      1,
      2,
      2
    ],
    "expected": 1
  },
  {
    "id": 2,
    "name": "Multiple duplicates",
    "input": "nums = [3, 2, 1, 2, 1, 7]",
    "nums": [
      3,
      2,
      1,
      2,
      1,
      7
    ],
    "expected": 6
  },
  {
    "id": 3,
    "name": "Empty array",
    "input": "nums = []",
    "nums": [],
    "expected": 0
  }
];

export const submitTests = [
  {
    "id": 1,
    "name": "Simple duplicate",
    "input": "nums = [1, 2, 2]",
    "nums": [
      1,
      2,
      2
    ],
    "expected": 1
  },
  {
    "id": 2,
    "name": "Multiple duplicates",
    "input": "nums = [3, 2, 1, 2, 1, 7]",
    "nums": [
      3,
      2,
      1,
      2,
      1,
      7
    ],
    "expected": 6
  },
  {
    "id": 3,
    "name": "Empty array",
    "input": "nums = []",
    "nums": [],
    "expected": 0
  },
  {
    "id": 4,
    "name": "All same",
    "input": "nums = [0, 0, 0, 0]",
    "nums": [
      0,
      0,
      0,
      0
    ],
    "expected": 6
  },
  {
    "id": 5,
    "name": "Includes negatives",
    "input": "nums = [-1, -1, 2, 2]",
    "nums": [
      -1,
      -1,
      2,
      2
    ],
    "expected": 2
  },
  {
    "id": 6,
    "name": "Already unique",
    "input": "nums = [1]",
    "nums": [
      1
    ],
    "expected": 0
  }
];
