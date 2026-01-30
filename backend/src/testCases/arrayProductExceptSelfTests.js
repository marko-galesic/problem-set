// Array Product Except Self test suite
//
// Test cases for arrayProductExceptSelf(int[] nums)

export const runTests = [
  {
    "id": 1,
    "name": "Basic",
    "input": "nums = [1, 2, 3, 4]",
    "nums": [
      1,
      2,
      3,
      4
    ],
    "expected": [
      24,
      12,
      8,
      6
    ]
  },
  {
    "id": 2,
    "name": "Contains zero",
    "input": "nums = [0, 1, 2, 3]",
    "nums": [
      0,
      1,
      2,
      3
    ],
    "expected": [
      6,
      0,
      0,
      0
    ]
  },
  {
    "id": 3,
    "name": "Single zero",
    "input": "nums = [2, 3, 0, 4]",
    "nums": [
      2,
      3,
      0,
      4
    ],
    "expected": [
      0,
      0,
      24,
      0
    ]
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "Negatives",
      "input": "nums = [-1, 1, -1, 1]",
      "nums": [
        -1,
        1,
        -1,
        1
      ],
      "expected": [
        -1,
        1,
        -1,
        1
      ]
    },
    {
      "id": 5,
      "name": "Short array",
      "input": "nums = [2, 3, 4]",
      "nums": [
        2,
        3,
        4
      ],
      "expected": [
        12,
        8,
        6
      ]
    }
];
