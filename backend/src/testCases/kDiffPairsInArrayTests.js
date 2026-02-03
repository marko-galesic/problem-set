// Auto-generated test suite

export const runTests = [
  {
    "id": 1,
    "name": "Basic example",
    "input": "nums = [3, 1, 4, 1, 5], k = 2",
    "nums": [
      3,
      1,
      4,
      1,
      5
    ],
    "k": 2,
    "expected": 2
  },
  {
    "id": 2,
    "name": "Consecutive numbers",
    "input": "nums = [1, 2, 3, 4, 5], k = 1",
    "nums": [
      1,
      2,
      3,
      4,
      5
    ],
    "k": 1,
    "expected": 4
  },
  {
    "id": 3,
    "name": "Zero diff",
    "input": "nums = [1, 3, 1, 5, 4], k = 0",
    "nums": [
      1,
      3,
      1,
      5,
      4
    ],
    "k": 0,
    "expected": 1
  }
];

export const submitTests = [
  {
    "id": 1,
    "name": "Basic example",
    "input": "nums = [3, 1, 4, 1, 5], k = 2",
    "nums": [
      3,
      1,
      4,
      1,
      5
    ],
    "k": 2,
    "expected": 2
  },
  {
    "id": 2,
    "name": "Consecutive numbers",
    "input": "nums = [1, 2, 3, 4, 5], k = 1",
    "nums": [
      1,
      2,
      3,
      4,
      5
    ],
    "k": 1,
    "expected": 4
  },
  {
    "id": 3,
    "name": "Zero diff",
    "input": "nums = [1, 3, 1, 5, 4], k = 0",
    "nums": [
      1,
      3,
      1,
      5,
      4
    ],
    "k": 0,
    "expected": 1
  },
  {
    "id": 4,
    "name": "Many duplicates",
    "input": "nums = [1, 2, 2, 2, 3], k = 0",
    "nums": [
      1,
      2,
      2,
      2,
      3
    ],
    "k": 0,
    "expected": 1
  },
  {
    "id": 5,
    "name": "No pairs",
    "input": "nums = [1, 2, 3], k = 5",
    "nums": [
      1,
      2,
      3
    ],
    "k": 5,
    "expected": 0
  },
  {
    "id": 6,
    "name": "Negative values",
    "input": "nums = [-1, -2, -3], k = 1",
    "nums": [
      -1,
      -2,
      -3
    ],
    "k": 1,
    "expected": 2
  }
];
