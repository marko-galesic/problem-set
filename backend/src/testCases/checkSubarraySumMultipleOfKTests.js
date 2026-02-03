// Auto-generated test suite

export const runTests = [
  {
    "id": 1,
    "name": "Has multiple",
    "input": "nums = [23, 2, 4, 6, 7], k = 6",
    "nums": [
      23,
      2,
      4,
      6,
      7
    ],
    "k": 6,
    "expected": true
  },
  {
    "id": 2,
    "name": "Another valid",
    "input": "nums = [23, 2, 6, 4, 7], k = 6",
    "nums": [
      23,
      2,
      6,
      4,
      7
    ],
    "k": 6,
    "expected": true
  },
  {
    "id": 3,
    "name": "No valid subarray",
    "input": "nums = [1, 2, 3], k = 7",
    "nums": [
      1,
      2,
      3
    ],
    "k": 7,
    "expected": false
  }
];

export const submitTests = [
  {
    "id": 1,
    "name": "Has multiple",
    "input": "nums = [23, 2, 4, 6, 7], k = 6",
    "nums": [
      23,
      2,
      4,
      6,
      7
    ],
    "k": 6,
    "expected": true
  },
  {
    "id": 2,
    "name": "Another valid",
    "input": "nums = [23, 2, 6, 4, 7], k = 6",
    "nums": [
      23,
      2,
      6,
      4,
      7
    ],
    "k": 6,
    "expected": true
  },
  {
    "id": 3,
    "name": "No valid subarray",
    "input": "nums = [1, 2, 3], k = 7",
    "nums": [
      1,
      2,
      3
    ],
    "k": 7,
    "expected": false
  },
  {
    "id": 4,
    "name": "Zeros with k=0",
    "input": "nums = [0, 0], k = 0",
    "nums": [
      0,
      0
    ],
    "k": 0,
    "expected": true
  },
  {
    "id": 5,
    "name": "Separated zeros with k=0",
    "input": "nums = [0, 1, 0], k = 0",
    "nums": [
      0,
      1,
      0
    ],
    "k": 0,
    "expected": false
  },
  {
    "id": 6,
    "name": "Zero sum multiple",
    "input": "nums = [5, 0, 0], k = 3",
    "nums": [
      5,
      0,
      0
    ],
    "k": 3,
    "expected": true
  }
];
