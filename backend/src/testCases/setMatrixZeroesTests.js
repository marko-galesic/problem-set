// Set Matrix Zeroes test suite
//
// Test cases for setZeroes(int[][] matrix) method
// Returns int[][] with rows and columns zeroed

export const runTests = [
  {
    id: 1,
    name: "Single zero in middle",
    input: "matrix = [[1,1,1],[1,0,1],[1,1,1]]",
    matrix: [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1]
    ],
    expected: [
      [1, 0, 1],
      [0, 0, 0],
      [1, 0, 1]
    ]
  },
  {
    id: 2,
    name: "Zeros in first row and column",
    input: "matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]",
    matrix: [
      [0, 1, 2, 0],
      [3, 4, 5, 2],
      [1, 3, 1, 5]
    ],
    expected: [
      [0, 0, 0, 0],
      [0, 4, 5, 0],
      [0, 3, 1, 0]
    ]
  },
  {
    id: 3,
    name: "Single row",
    input: "matrix = [[1,0,3]]",
    matrix: [[1, 0, 3]],
    expected: [[0, 0, 0]]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "No zeros",
    input: "matrix = [[1,2],[3,4]]",
    matrix: [
      [1, 2],
      [3, 4]
    ],
    expected: [
      [1, 2],
      [3, 4]
    ]
  },
  {
    id: 5,
    name: "Single column",
    input: "matrix = [[1],[0],[3]]",
    matrix: [
      [1],
      [0],
      [3]
    ],
    expected: [
      [0],
      [0],
      [0]
    ]
  },
  {
    id: 6,
    name: "All zeros",
    input: "matrix = [[0,0],[0,0]]",
    matrix: [
      [0, 0],
      [0, 0]
    ],
    expected: [
      [0, 0],
      [0, 0]
    ]
  },
  {
    id: 7,
    name: "Zero on edge",
    input: "matrix = [[1,2,0],[4,5,6]]",
    matrix: [
      [1, 2, 0],
      [4, 5, 6]
    ],
    expected: [
      [0, 0, 0],
      [4, 5, 0]
    ]
  },
  {
    id: 8,
    name: "Empty matrix",
    input: "matrix = []",
    matrix: [],
    expected: []
  }
];
