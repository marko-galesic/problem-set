// House Robber test suite
//
// Test cases for rob method

export const runTests = [
  {
    "id": 1,
    "name": "Basic example",
    "input": "nums = [1, 2, 3, 1]",
    "nums": [
      1,
      2,
      3,
      1
    ],
    "expected": 4
  },
  {
    "id": 2,
    "name": "Larger example",
    "input": "nums = [2, 7, 9, 3, 1]",
    "nums": [
      2,
      7,
      9,
      3,
      1
    ],
    "expected": 12
  },
  {
    "id": 3,
    "name": "Non-adjacent picks",
    "input": "nums = [2, 1, 1, 2]",
    "nums": [
      2,
      1,
      1,
      2
    ],
    "expected": 4
  }
];

export const submitTests = [
  {
    "id": 4,
    "name": "Empty array",
    "input": "nums = []",
    "nums": [],
    "expected": 0
  },
  {
    "id": 5,
    "name": "Single house",
    "input": "nums = [5]",
    "nums": [
      5
    ],
    "expected": 5
  },
  {
    "id": 6,
    "name": "Two houses",
    "input": "nums = [1, 2]",
    "nums": [
      1,
      2
    ],
    "expected": 2
  },
  {
    "id": 7,
    "name": "Multiple choices",
    "input": "nums = [2, 1, 4, 5, 3, 1, 1, 3]",
    "nums": [
      2,
      1,
      4,
      5,
      3,
      1,
      1,
      3
    ],
    "expected": 12
  }
];
