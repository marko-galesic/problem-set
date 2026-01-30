// Find Peak Element test suite
//
// Test cases for findPeakElement(int[] nums)

export const runTests = [
  {
    "id": 1,
    "name": "Peak in middle",
    "input": "nums = [1,2,3,1]",
    "nums": [
      1,
      2,
      3,
      1
    ],
    "expected": 2
  },
  {
    "id": 2,
    "name": "Single",
    "input": "nums = [1]",
    "nums": [
      1
    ],
    "expected": 0
  },
  {
    "id": 3,
    "name": "Two elements",
    "input": "nums = [2,1]",
    "nums": [
      2,
      1
    ],
    "expected": 0
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "Mountain",
      "input": "nums = [1,2,3,4,3,2,1]",
      "nums": [
        1,
        2,
        3,
        4,
        3,
        2,
        1
      ],
      "expected": 3
    },
    {
      "id": 5,
      "name": "Small peak",
      "input": "nums = [1,2,1]",
      "nums": [
        1,
        2,
        1
      ],
      "expected": 1
    }
];
