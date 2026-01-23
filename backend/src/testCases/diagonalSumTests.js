// Diagonal Sum test suite
//
// Test cases for diagonalSum(int[][] matrix) method
// Returns int

export const runTests = [
  {
    id: 1,
    name: "Case 1",
    input: "matrix = [[1, 2], [3, 4]]",
    matrix: [[1, 2], [3, 4]],
    expected: 5
  },
  {
    id: 2,
    name: "Case 2",
    input: "matrix = [[5]]",
    matrix: [[5]],
    expected: 5
  },
  {
    id: 3,
    name: "Case 3",
    input: "matrix = [[1, 0, 0], [0, 2, 0], [0, 0, 3]]",
    matrix: [[1, 0, 0], [0, 2, 0], [0, 0, 3]],
    expected: 6
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Case 4",
    input: "matrix = [[-1, 2], [3, -4]]",
    matrix: [[-1, 2], [3, -4]],
    expected: -5
  },
  {
    id: 5,
    name: "Case 5",
    input: "matrix = []",
    matrix: [],
    expected: 0
  }
];
