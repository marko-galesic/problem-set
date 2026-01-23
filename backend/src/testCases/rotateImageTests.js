// Rotate Image test suite
//
// Test cases for rotate(int[][] matrix) method
// Returns int[][] rotated 90 degrees clockwise

export const runTests = [
  {
    id: 1,
    name: "Two by two",
    input: "matrix = [[1,2],[3,4]]",
    matrix: [
      [1, 2],
      [3, 4]
    ],
    expected: [
      [3, 1],
      [4, 2]
    ]
  },
  {
    id: 2,
    name: "Three by three",
    input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
    matrix: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ],
    expected: [
      [7, 4, 1],
      [8, 5, 2],
      [9, 6, 3]
    ]
  },
  {
    id: 3,
    name: "Single element",
    input: "matrix = [[42]]",
    matrix: [[42]],
    expected: [[42]]
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Four by four",
    input: "matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]]",
    matrix: [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 16]
    ],
    expected: [
      [13, 9, 5, 1],
      [14, 10, 6, 2],
      [15, 11, 7, 3],
      [16, 12, 8, 4]
    ]
  },
  {
    id: 5,
    name: "Zeros and negatives",
    input: "matrix = [[0,-1,2],[3,4,5],[6,7,8]]",
    matrix: [
      [0, -1, 2],
      [3, 4, 5],
      [6, 7, 8]
    ],
    expected: [
      [6, 3, 0],
      [7, 4, -1],
      [8, 5, 2]
    ]
  },
  {
    id: 6,
    name: "Empty matrix",
    input: "matrix = []",
    matrix: [],
    expected: []
  }
];
