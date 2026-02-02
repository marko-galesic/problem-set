// Max Consecutive Ones with K Flips test suite
//
// Test cases for maxConsecutiveOnesWithKFlips method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Flip in the middle",
    "input": "nums = [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], k = 2",
    "nums": [
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      0
    ],
    "k": 2,
    "expected": 6
  },
  {
    "id": 2,
    "name": "No flips allowed",
    "input": "nums = [0, 0, 1, 1, 1, 0, 0], k = 0",
    "nums": [
      0,
      0,
      1,
      1,
      1,
      0,
      0
    ],
    "k": 0,
    "expected": 3
  },
  {
    "id": 3,
    "name": "One flip",
    "input": "nums = [1, 0, 1, 0, 1], k = 1",
    "nums": [
      1,
      0,
      1,
      0,
      1
    ],
    "k": 1,
    "expected": 3
  }
];

export const submitTests = [
  ...runTests
];
