// Search 2D Matrix test suite
//
// Test cases for searchMatrix method

export const runTests = [
  {
    "id": 1,
    "name": "Target found",
    "input": "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3",
    "matrix": [
      [
        1,
        3,
        5,
        7
      ],
      [
        10,
        11,
        16,
        20
      ],
      [
        23,
        30,
        34,
        60
      ]
    ],
    "target": 3,
    "expected": true
  },
  {
    "id": 2,
    "name": "Target missing",
    "input": "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13",
    "matrix": [
      [
        1,
        3,
        5,
        7
      ],
      [
        10,
        11,
        16,
        20
      ],
      [
        23,
        30,
        34,
        60
      ]
    ],
    "target": 13,
    "expected": false
  },
  {
    "id": 3,
    "name": "Single cell",
    "input": "matrix = [[1]], target = 1",
    "matrix": [
      [
        1
      ]
    ],
    "target": 1,
    "expected": true
  }
];

export const submitTests = [
  {
    "id": 4,
    "name": "Empty matrix",
    "input": "matrix = [], target = 1",
    "matrix": [],
    "target": 1,
    "expected": false
  },
  {
    "id": 5,
    "name": "Single row hit",
    "input": "matrix = [[1, 2, 3]], target = 2",
    "matrix": [
      [
        1,
        2,
        3
      ]
    ],
    "target": 2,
    "expected": true
  },
  {
    "id": 6,
    "name": "Single row miss",
    "input": "matrix = [[1, 2, 3]], target = 4",
    "matrix": [
      [
        1,
        2,
        3
      ]
    ],
    "target": 4,
    "expected": false
  }
];
