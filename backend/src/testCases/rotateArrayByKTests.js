// Rotate Array by K test suite
//
// Test cases for rotateArrayByK method
// Returns intArray

export const runTests = [
  {
    "id": 1,
    "name": "Rotate by three",
    "input": "nums = [1, 2, 3, 4, 5, 6, 7], k = 3",
    "nums": [
      1,
      2,
      3,
      4,
      5,
      6,
      7
    ],
    "k": 3,
    "expected": [
      5,
      6,
      7,
      1,
      2,
      3,
      4
    ]
  },
  {
    "id": 2,
    "name": "Rotate by two",
    "input": "nums = [-1, -100, 3, 99], k = 2",
    "nums": [
      -1,
      -100,
      3,
      99
    ],
    "k": 2,
    "expected": [
      3,
      99,
      -1,
      -100
    ]
  },
  {
    "id": 3,
    "name": "Single element",
    "input": "nums = [1], k = 10",
    "nums": [
      1
    ],
    "k": 10,
    "expected": [
      1
    ]
  }
];

export const submitTests = [
  ...runTests
];
