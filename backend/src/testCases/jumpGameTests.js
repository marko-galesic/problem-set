// Jump Game test suite
//
// Test cases for canJump method

export const runTests = [
  {
    "id": 1,
    "name": "Reachable",
    "input": "nums = [2, 3, 1, 1, 4]",
    "nums": [
      2,
      3,
      1,
      1,
      4
    ],
    "expected": true
  },
  {
    "id": 2,
    "name": "Blocked by zero",
    "input": "nums = [3, 2, 1, 0, 4]",
    "nums": [
      3,
      2,
      1,
      0,
      4
    ],
    "expected": false
  },
  {
    "id": 3,
    "name": "Single element",
    "input": "nums = [0]",
    "nums": [
      0
    ],
    "expected": true
  }
];

export const submitTests = [
  {
    "id": 4,
    "name": "Short array",
    "input": "nums = [2, 0, 0]",
    "nums": [
      2,
      0,
      0
    ],
    "expected": true
  },
  {
    "id": 5,
    "name": "Unreachable tail",
    "input": "nums = [1, 1, 0, 1]",
    "nums": [
      1,
      1,
      0,
      1
    ],
    "expected": false
  },
  {
    "id": 6,
    "name": "Big jump",
    "input": "nums = [2, 5, 0, 0]",
    "nums": [
      2,
      5,
      0,
      0
    ],
    "expected": true
  },
  {
    "id": 7,
    "name": "Ascending",
    "input": "nums = [1, 2, 3]",
    "nums": [
      1,
      2,
      3
    ],
    "expected": true
  },
  {
    "id": 8,
    "name": "Multiple zeros",
    "input": "nums = [1, 0, 1, 0]",
    "nums": [
      1,
      0,
      1,
      0
    ],
    "expected": false
  }
];
