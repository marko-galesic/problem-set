// Flood Fill test suite
//
// Test cases for floodFill method

export const runTests = [
  {
    "id": 1,
    "name": "Fill center",
    "input": "image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2",
    "image": [
      [
        1,
        1,
        1
      ],
      [
        1,
        1,
        0
      ],
      [
        1,
        0,
        1
      ]
    ],
    "sr": 1,
    "sc": 1,
    "color": 2,
    "expected": [
      [
        2,
        2,
        2
      ],
      [
        2,
        2,
        0
      ],
      [
        2,
        0,
        1
      ]
    ]
  },
  {
    "id": 2,
    "name": "Fill all",
    "input": "image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 2",
    "image": [
      [
        0,
        0,
        0
      ],
      [
        0,
        0,
        0
      ]
    ],
    "sr": 0,
    "sc": 0,
    "color": 2,
    "expected": [
      [
        2,
        2,
        2
      ],
      [
        2,
        2,
        2
      ]
    ]
  },
  {
    "id": 3,
    "name": "No change",
    "input": "image = [[1,1,1],[1,1,0],[1,0,1]], sr = 0, sc = 0, color = 1",
    "image": [
      [
        1,
        1,
        1
      ],
      [
        1,
        1,
        0
      ],
      [
        1,
        0,
        1
      ]
    ],
    "sr": 0,
    "sc": 0,
    "color": 1,
    "expected": [
      [
        1,
        1,
        1
      ],
      [
        1,
        1,
        0
      ],
      [
        1,
        0,
        1
      ]
    ]
  }
];

export const submitTests = [
  {
    "id": 4,
    "name": "Isolated cell",
    "input": "image = [[1,1,1],[1,1,0],[1,0,1]], sr = 2, sc = 2, color = 3",
    "image": [
      [
        1,
        1,
        1
      ],
      [
        1,
        1,
        0
      ],
      [
        1,
        0,
        1
      ]
    ],
    "sr": 2,
    "sc": 2,
    "color": 3,
    "expected": [
      [
        1,
        1,
        1
      ],
      [
        1,
        1,
        0
      ],
      [
        1,
        0,
        3
      ]
    ]
  },
  {
    "id": 5,
    "name": "Center change",
    "input": "image = [[2,2,2],[2,1,2],[2,2,2]], sr = 1, sc = 1, color = 2",
    "image": [
      [
        2,
        2,
        2
      ],
      [
        2,
        1,
        2
      ],
      [
        2,
        2,
        2
      ]
    ],
    "sr": 1,
    "sc": 1,
    "color": 2,
    "expected": [
      [
        2,
        2,
        2
      ],
      [
        2,
        2,
        2
      ],
      [
        2,
        2,
        2
      ]
    ]
  },
  {
    "id": 6,
    "name": "Single cell row",
    "input": "image = [[1,2,3],[4,5,6]], sr = 0, sc = 1, color = 9",
    "image": [
      [
        1,
        2,
        3
      ],
      [
        4,
        5,
        6
      ]
    ],
    "sr": 0,
    "sc": 1,
    "color": 9,
    "expected": [
      [
        1,
        9,
        3
      ],
      [
        4,
        5,
        6
      ]
    ]
  }
];
