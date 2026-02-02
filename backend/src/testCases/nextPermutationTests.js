// Next Permutation test suite
//
// Test cases for nextPermutation(nums) method
// Returns int[]

export const runTests = [
  {
    "id": 1,
    "name": "Increasing order",
    "input": "nums = [1, 2, 3]",
    "nums": [
      1,
      2,
      3
    ],
    "expected": [
      1,
      3,
      2
    ]
  },
  {
    "id": 2,
    "name": "Descending order",
    "input": "nums = [3, 2, 1]",
    "nums": [
      3,
      2,
      1
    ],
    "expected": [
      1,
      2,
      3
    ]
  },
  {
    "id": 3,
    "name": "With duplicates",
    "input": "nums = [1, 1, 5]",
    "nums": [
      1,
      1,
      5
    ],
    "expected": [
      1,
      5,
      1
    ]
  },
  {
    "id": 4,
    "name": "Middle pivot",
    "input": "nums = [1, 3, 2]",
    "nums": [
      1,
      3,
      2
    ],
    "expected": [
      2,
      1,
      3
    ]
  }
];

export const submitTests = [
  ...runTests
];
