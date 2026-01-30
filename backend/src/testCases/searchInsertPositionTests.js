// Search Insert Position test suite
//
// Test cases for searchInsert method

export const runTests = [
  {
    "id": 1,
    "name": "Target present",
    "input": "nums = [1, 3, 5, 6], target = 5",
    "nums": [
      1,
      3,
      5,
      6
    ],
    "target": 5,
    "expected": 2
  },
  {
    "id": 2,
    "name": "Insert middle",
    "input": "nums = [1, 3, 5, 6], target = 2",
    "nums": [
      1,
      3,
      5,
      6
    ],
    "target": 2,
    "expected": 1
  },
  {
    "id": 3,
    "name": "Insert end",
    "input": "nums = [1, 3, 5, 6], target = 7",
    "nums": [
      1,
      3,
      5,
      6
    ],
    "target": 7,
    "expected": 4
  }
];

export const submitTests = [
  {
    "id": 4,
    "name": "Insert start",
    "input": "nums = [1, 3, 5, 6], target = 0",
    "nums": [
      1,
      3,
      5,
      6
    ],
    "target": 0,
    "expected": 0
  },
  {
    "id": 5,
    "name": "Single element",
    "input": "nums = [1], target = 0",
    "nums": [
      1
    ],
    "target": 0,
    "expected": 0
  },
  {
    "id": 6,
    "name": "Single element end",
    "input": "nums = [1], target = 2",
    "nums": [
      1
    ],
    "target": 2,
    "expected": 1
  },
  {
    "id": 7,
    "name": "Two elements",
    "input": "nums = [1, 3], target = 3",
    "nums": [
      1,
      3
    ],
    "target": 3,
    "expected": 1
  }
];
