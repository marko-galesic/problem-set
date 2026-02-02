// Interval List Intersections test suite
//
// Test cases for intervalIntersection(firstList, secondList) method
// Returns int[][]

export const runTests = [
  {
    "id": 1,
    "name": "Multiple intersections",
    "input": "firstList = [[0, 2], [5, 10], [13, 23], [24, 25]], secondList = [[1, 5], [8, 12], [15, 24], [25, 26]]",
    "firstList": [
      [
        0,
        2
      ],
      [
        5,
        10
      ],
      [
        13,
        23
      ],
      [
        24,
        25
      ]
    ],
    "secondList": [
      [
        1,
        5
      ],
      [
        8,
        12
      ],
      [
        15,
        24
      ],
      [
        25,
        26
      ]
    ],
    "expected": [
      [
        1,
        2
      ],
      [
        5,
        5
      ],
      [
        8,
        10
      ],
      [
        15,
        23
      ],
      [
        24,
        24
      ],
      [
        25,
        25
      ]
    ]
  },
  {
    "id": 2,
    "name": "Empty second list",
    "input": "firstList = [[1, 3], [5, 9]], secondList = []",
    "firstList": [
      [
        1,
        3
      ],
      [
        5,
        9
      ]
    ],
    "secondList": [],
    "expected": []
  },
  {
    "id": 3,
    "name": "Single overlap",
    "input": "firstList = [[1, 7]], secondList = [[3, 10]]",
    "firstList": [
      [
        1,
        7
      ]
    ],
    "secondList": [
      [
        3,
        10
      ]
    ],
    "expected": [
      [
        3,
        7
      ]
    ]
  },
  {
    "id": 4,
    "name": "No intersection",
    "input": "firstList = [[4, 6]], secondList = [[1, 2], [8, 10]]",
    "firstList": [
      [
        4,
        6
      ]
    ],
    "secondList": [
      [
        1,
        2
      ],
      [
        8,
        10
      ]
    ],
    "expected": []
  }
];

export const submitTests = [
  ...runTests
];
