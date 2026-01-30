// Merge Sorted Array test suite
//
// Test cases for mergeSortedArray method

export const runTests = [
  {
    "id": 1,
    "name": "Classic merge",
    "input": "nums1 = [1, 2, 3, 0, 0, 0], m = 3, nums2 = [2, 5, 6], n = 3",
    "nums1": [
      1,
      2,
      3,
      0,
      0,
      0
    ],
    "m": 3,
    "nums2": [
      2,
      5,
      6
    ],
    "n": 3,
    "expected": [
      1,
      2,
      2,
      3,
      5,
      6
    ]
  },
  {
    "id": 2,
    "name": "Second array empty",
    "input": "nums1 = [1], m = 1, nums2 = [], n = 0",
    "nums1": [
      1
    ],
    "m": 1,
    "nums2": [],
    "n": 0,
    "expected": [
      1
    ]
  },
  {
    "id": 3,
    "name": "First array empty",
    "input": "nums1 = [0], m = 0, nums2 = [1], n = 1",
    "nums1": [
      0
    ],
    "m": 0,
    "nums2": [
      1
    ],
    "n": 1,
    "expected": [
      1
    ]
  }
];

export const submitTests = [
  {
    "id": 4,
    "name": "Two elements",
    "input": "nums1 = [2, 0], m = 1, nums2 = [1], n = 1",
    "nums1": [
      2,
      0
    ],
    "m": 1,
    "nums2": [
      1
    ],
    "n": 1,
    "expected": [
      1,
      2
    ]
  },
  {
    "id": 5,
    "name": "Descending blocks",
    "input": "nums1 = [4, 5, 6, 0, 0, 0], m = 3, nums2 = [1, 2, 3], n = 3",
    "nums1": [
      4,
      5,
      6,
      0,
      0,
      0
    ],
    "m": 3,
    "nums2": [
      1,
      2,
      3
    ],
    "n": 3,
    "expected": [
      1,
      2,
      3,
      4,
      5,
      6
    ]
  },
  {
    "id": 6,
    "name": "Single insert",
    "input": "nums1 = [1, 2, 4, 5, 6, 0], m = 5, nums2 = [3], n = 1",
    "nums1": [
      1,
      2,
      4,
      5,
      6,
      0
    ],
    "m": 5,
    "nums2": [
      3
    ],
    "n": 1,
    "expected": [
      1,
      2,
      3,
      4,
      5,
      6
    ]
  }
];
