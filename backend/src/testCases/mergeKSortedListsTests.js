// Merge K Sorted Lists test suite
//
// Test cases for mergeKSortedLists(int[][] lists)

export const runTests = [
  {
    "id": 1,
    "name": "Three lists",
    "input": "lists = [[1,4,5],[1,3,4],[2,6]]",
    "lists": [
      [
        1,
        4,
        5
      ],
      [
        1,
        3,
        4
      ],
      [
        2,
        6
      ]
    ],
    "expected": [
      1,
      1,
      2,
      3,
      4,
      4,
      5,
      6
    ]
  },
  {
    "id": 2,
    "name": "Empty input",
    "input": "lists = []",
    "lists": [],
    "expected": []
  },
  {
    "id": 3,
    "name": "Negatives and duplicates",
    "input": "lists = [[-2,-1,0],[1],[2,2]]",
    "lists": [
      [
        -2,
        -1,
        0
      ],
      [
        1
      ],
      [
        2,
        2
      ]
    ],
    "expected": [
      -2,
      -1,
      0,
      1,
      2,
      2
    ]
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "Singletons",
      "input": "lists = [[5],[1,2,3],[4,6]]",
      "lists": [
        [
          5
        ],
        [
          1,
          2,
          3
        ],
        [
          4,
          6
        ]
      ],
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
      "id": 5,
      "name": "With empty list",
      "input": "lists = [[],[0],[-1,2]]",
      "lists": [
        [],
        [
          0
        ],
        [
          -1,
          2
        ]
      ],
      "expected": [
        -1,
        0,
        2
      ]
    }
];
