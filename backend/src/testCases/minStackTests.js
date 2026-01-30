// Min Stack test suite
//
// Test cases for minStackOps method

export const runTests = [
  {
    "id": 1,
    "name": "Basic operations",
    "input": "ops = [\"push\", \"push\", \"push\", \"getMin\", \"pop\", \"top\", \"getMin\"]; values = [[5], [2], [7], [], [], [], []]",
    "ops": [
      "push",
      "push",
      "push",
      "getMin",
      "pop",
      "top",
      "getMin"
    ],
    "values": [
      [
        5
      ],
      [
        2
      ],
      [
        7
      ],
      [],
      [],
      [],
      []
    ],
    "expected": [
      2,
      2,
      2
    ]
  },
  {
    "id": 2,
    "name": "Empty stack queries",
    "input": "ops = [\"top\", \"getMin\", \"push\", \"getMin\", \"pop\", \"getMin\"]; values = [[], [], [3], [], [], []]",
    "ops": [
      "top",
      "getMin",
      "push",
      "getMin",
      "pop",
      "getMin"
    ],
    "values": [
      [],
      [],
      [
        3
      ],
      [],
      [],
      []
    ],
    "expected": [
      -1,
      -1,
      3,
      -1
    ]
  },
  {
    "id": 3,
    "name": "Min tracking",
    "input": "ops = [\"push\", \"push\", \"getMin\", \"push\", \"getMin\", \"pop\", \"getMin\", \"pop\", \"top\"]; values = [[2], [0], [], [-1], [], [], [], [], []]",
    "ops": [
      "push",
      "push",
      "getMin",
      "push",
      "getMin",
      "pop",
      "getMin",
      "pop",
      "top"
    ],
    "values": [
      [
        2
      ],
      [
        0
      ],
      [],
      [
        -1
      ],
      [],
      [],
      [],
      [],
      []
    ],
    "expected": [
      0,
      -1,
      0,
      2
    ]
  }
];

export const submitTests = [
  {
    "id": 4,
    "name": "Repeated values",
    "input": "ops = [\"push\", \"push\", \"pop\", \"getMin\"]; values = [[1], [1], [], []]",
    "ops": [
      "push",
      "push",
      "pop",
      "getMin"
    ],
    "values": [
      [
        1
      ],
      [
        1
      ],
      [],
      []
    ],
    "expected": [
      1
    ]
  },
  {
    "id": 5,
    "name": "Only queries",
    "input": "ops = [\"top\", \"pop\", \"top\"]; values = [[], [], []]",
    "ops": [
      "top",
      "pop",
      "top"
    ],
    "values": [
      [],
      [],
      []
    ],
    "expected": [
      -1,
      -1
    ]
  }
];
