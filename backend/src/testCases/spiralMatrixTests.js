// Spiral Matrix test suite
//
// Test cases for spiralOrder(int[][] matrix) method
// Returns int[] representing spiral traversal

export const runTests = [
  {
    id: 1,
    name: "Square matrix",
    input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
    matrix: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ],
    expected: [1, 2, 3, 6, 9, 8, 7, 4, 5]
  },
  {
    id: 2,
    name: "Rectangle matrix",
    input: "matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]",
    matrix: [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12]
    ],
    expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]
  },
  {
    id: 3,
    name: "Single row",
    input: "matrix = [[1,2,3]]",
    matrix: [[1, 2, 3]],
    expected: [1, 2, 3]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Single column",
    input: "matrix = [[1],[2],[3],[4]]",
    matrix: [[1], [2], [3], [4]],
    expected: [1, 2, 3, 4]
  },
  {
    id: 5,
    name: "Two by two",
    input: "matrix = [[1,2],[3,4]]",
    matrix: [
      [1, 2],
      [3, 4]
    ],
    expected: [1, 2, 4, 3]
  },
  {
    id: 6,
    name: "Single element",
    input: "matrix = [[7]]",
    matrix: [[7]],
    expected: [7]
  },
  {
    id: 7,
    name: "Empty matrix",
    input: "matrix = []",
    matrix: [],
    expected: []
  }
];
