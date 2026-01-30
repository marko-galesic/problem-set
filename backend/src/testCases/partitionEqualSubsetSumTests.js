// Partition Equal Subset Sum test suite
//
// Test cases for canPartition(int[] nums)

export const runTests = [
  {
    "id": 1,
    "name": "Possible",
    "input": "nums = [1,5,11,5]",
    "nums": [
      1,
      5,
      11,
      5
    ],
    "expected": true
  },
  {
    "id": 2,
    "name": "Not possible",
    "input": "nums = [1,2,3,5]",
    "nums": [
      1,
      2,
      3,
      5
    ],
    "expected": false
  },
  {
    "id": 3,
    "name": "Small possible",
    "input": "nums = [2,2,1,1]",
    "nums": [
      2,
      2,
      1,
      1
    ],
    "expected": true
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "Another possible",
      "input": "nums = [3,3,3,4,5]",
      "nums": [
        3,
        3,
        3,
        4,
        5
      ],
      "expected": true
    },
    {
      "id": 5,
      "name": "Not possible",
      "input": "nums = [1,2,5]",
      "nums": [
        1,
        2,
        5
      ],
      "expected": false
    }
];
