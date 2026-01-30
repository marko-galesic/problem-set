// Plus One test suite
//
// Test cases for plusOne method

export const runTests = [
  {
    "id": 1,
    "name": "Simple",
    "input": "digits = [1, 2, 3]",
    "digits": [
      1,
      2,
      3
    ],
    "expected": [
      1,
      2,
      4
    ]
  },
  {
    "id": 2,
    "name": "Carry",
    "input": "digits = [9]",
    "digits": [
      9
    ],
    "expected": [
      1,
      0
    ]
  },
  {
    "id": 3,
    "name": "All nines",
    "input": "digits = [9, 9, 9]",
    "digits": [
      9,
      9,
      9
    ],
    "expected": [
      1,
      0,
      0,
      0
    ]
  }
];

export const submitTests = [
  {
    "id": 4,
    "name": "Zero",
    "input": "digits = [0]",
    "digits": [
      0
    ],
    "expected": [
      1
    ]
  },
  {
    "id": 5,
    "name": "Mixed carry",
    "input": "digits = [2, 9, 9]",
    "digits": [
      2,
      9,
      9
    ],
    "expected": [
      3,
      0,
      0
    ]
  },
  {
    "id": 6,
    "name": "No carry",
    "input": "digits = [4, 3, 2, 1]",
    "digits": [
      4,
      3,
      2,
      1
    ],
    "expected": [
      4,
      3,
      2,
      2
    ]
  }
];
