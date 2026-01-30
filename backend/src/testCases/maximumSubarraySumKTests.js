// Maximum Subarray Sum K test suite
//
// Test cases for maximumSubarraySumK(int[] nums, int k)

export const runTests = [
  {
    "id": 1,
    "name": "Example",
    "input": "nums = [1,4,2,10,2,3,1,0,20], k = 4",
    "nums": [
      1,
      4,
      2,
      10,
      2,
      3,
      1,
      0,
      20
    ],
    "k": 4,
    "expected": 24
  },
  {
    "id": 2,
    "name": "Simple",
    "input": "nums = [100,200,300,400], k = 2",
    "nums": [
      100,
      200,
      300,
      400
    ],
    "k": 2,
    "expected": 700
  },
  {
    "id": 3,
    "name": "All negative",
    "input": "nums = [-1,-2,-3,-4], k = 2",
    "nums": [
      -1,
      -2,
      -3,
      -4
    ],
    "k": 2,
    "expected": -3
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "k equals 1",
      "input": "nums = [5,5,5,5], k = 1",
      "nums": [
        5,
        5,
        5,
        5
      ],
      "k": 1,
      "expected": 5
    },
    {
      "id": 5,
      "name": "Mixed",
      "input": "nums = [2,1,5,1,3,2], k = 3",
      "nums": [
        2,
        1,
        5,
        1,
        3,
        2
      ],
      "k": 3,
      "expected": 9
    }
];
