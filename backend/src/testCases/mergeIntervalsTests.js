// Merge Intervals test suite
//
// Test cases for merge(int[][] intervals) method
// Returns int[][] of merged intervals

export const runTests = [
  {
    id: 1,
    name: "Basic overlaps",
    input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
    intervals: [
      [1, 3],
      [2, 6],
      [8, 10],
      [15, 18]
    ],
    expected: [
      [1, 6],
      [8, 10],
      [15, 18]
    ]
  },
  {
    id: 2,
    name: "Unsorted with touching endpoints",
    input: "intervals = [[5,7],[1,4],[4,5]]",
    intervals: [
      [5, 7],
      [1, 4],
      [4, 5]
    ],
    expected: [
      [1, 7]
    ]
  },
  {
    id: 3,
    name: "Disjoint intervals",
    input: "intervals = [[6,7],[1,2],[3,4]]",
    intervals: [
      [6, 7],
      [1, 2],
      [3, 4]
    ],
    expected: [
      [1, 2],
      [3, 4],
      [6, 7]
    ]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Contained intervals",
    input: "intervals = [[1,10],[2,3],[4,8]]",
    intervals: [
      [1, 10],
      [2, 3],
      [4, 8]
    ],
    expected: [
      [1, 10]
    ]
  },
  {
    id: 5,
    name: "Single interval",
    input: "intervals = [[2,3]]",
    intervals: [
      [2, 3]
    ],
    expected: [
      [2, 3]
    ]
  },
  {
    id: 6,
    name: "Empty input",
    input: "intervals = []",
    intervals: [],
    expected: []
  },
  {
    id: 7,
    name: "Duplicate intervals",
    input: "intervals = [[1,4],[1,4]]",
    intervals: [
      [1, 4],
      [1, 4]
    ],
    expected: [
      [1, 4]
    ]
  },
  {
    id: 8,
    name: "Negative ranges",
    input: "intervals = [[-10,-1],[-5,0],[1,2]]",
    intervals: [
      [-10, -1],
      [-5, 0],
      [1, 2]
    ],
    expected: [
      [-10, 0],
      [1, 2]
    ]
  }
];
