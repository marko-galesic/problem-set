// Sort Colors test suite
//
// Test cases for sortColors(nums) method
// Returns int[]

export const runTests = [
  {
    "id": 1,
    "name": "Mixed colors",
    "input": "nums = [2, 0, 2, 1, 1, 0]",
    "nums": [
      2,
      0,
      2,
      1,
      1,
      0
    ],
    "expected": [
      0,
      0,
      1,
      1,
      2,
      2
    ]
  },
  {
    "id": 2,
    "name": "Short array",
    "input": "nums = [2, 0, 1]",
    "nums": [
      2,
      0,
      1
    ],
    "expected": [
      0,
      1,
      2
    ]
  },
  {
    "id": 3,
    "name": "Single color",
    "input": "nums = [0]",
    "nums": [
      0
    ],
    "expected": [
      0
    ]
  },
  {
    "id": 4,
    "name": "Equal counts",
    "input": "nums = [1, 2, 0, 1, 2, 0]",
    "nums": [
      1,
      2,
      0,
      1,
      2,
      0
    ],
    "expected": [
      0,
      0,
      1,
      1,
      2,
      2
    ]
  }
];

export const submitTests = [
  ...runTests
];
