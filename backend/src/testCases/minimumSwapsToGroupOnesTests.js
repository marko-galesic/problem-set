// Minimum Swaps to Group Ones test suite
//
// Test cases for minimumSwapsToGroupOnes method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Alternating ones",
    "input": "nums = [1, 0, 1, 0, 1]",
    "nums": [
      1,
      0,
      1,
      0,
      1
    ],
    "expected": 1
  },
  {
    "id": 2,
    "name": "Clustered ones",
    "input": "nums = [1, 1, 0, 0, 1]",
    "nums": [
      1,
      1,
      0,
      0,
      1
    ],
    "expected": 1
  },
  {
    "id": 3,
    "name": "All ones",
    "input": "nums = [1, 1, 1]",
    "nums": [
      1,
      1,
      1
    ],
    "expected": 0
  },
  {
    "id": 4,
    "name": "No ones",
    "input": "nums = [0, 0, 0]",
    "nums": [
      0,
      0,
      0
    ],
    "expected": 0
  }
];

export const submitTests = [
  ...runTests
];
