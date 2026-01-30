// Find Pivot Index test suite
//
// Test cases for pivotIndex method

export const runTests = [
  {
    "id": 1,
    "name": "Example",
    "input": "nums = [1, 7, 3, 6, 5, 6]",
    "nums": [
      1,
      7,
      3,
      6,
      5,
      6
    ],
    "expected": 3
  },
  {
    "id": 2,
    "name": "No pivot",
    "input": "nums = [1, 2, 3]",
    "nums": [
      1,
      2,
      3
    ],
    "expected": -1
  },
  {
    "id": 3,
    "name": "Zero pivot",
    "input": "nums = [2, 1, -1]",
    "nums": [
      2,
      1,
      -1
    ],
    "expected": 0
  }
];

export const submitTests = [
  {
    "id": 4,
    "name": "All zeros",
    "input": "nums = [0, 0, 0, 0]",
    "nums": [
      0,
      0,
      0,
      0
    ],
    "expected": 0
  },
  {
    "id": 5,
    "name": "Right pivot",
    "input": "nums = [1, -1, 4]",
    "nums": [
      1,
      -1,
      4
    ],
    "expected": 2
  },
  {
    "id": 6,
    "name": "Front pivot",
    "input": "nums = [10, -5, 5]",
    "nums": [
      10,
      -5,
      5
    ],
    "expected": 0
  }
];
