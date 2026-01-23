// Transpose Matrix test suite
//
// Test cases for transposeMatrix(int[][] matrix) method
// Returns intMatrix

export const runTests = [
  {
    id: 1,
    name: "Case 1",
    input: "matrix = [[1, 2, 3], [4, 5, 6]]",
    matrix: [[1, 2, 3], [4, 5, 6]],
    expected: [[1, 4], [2, 5], [3, 6]]
  },
  {
    id: 2,
    name: "Case 2",
    input: "matrix = [[1]]",
    matrix: [[1]],
    expected: [[1]]
  },
  {
    id: 3,
    name: "Case 3",
    input: "matrix = []",
    matrix: [],
    expected: []
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Case 4",
    input: "matrix = [[1, 2], [3, 4]]",
    matrix: [[1, 2], [3, 4]],
    expected: [[1, 3], [2, 4]]
  },
  {
    id: 5,
    name: "Case 5",
    input: "matrix = [[1, 2, 3]]",
    matrix: [[1, 2, 3]],
    expected: [[1], [2], [3]]
  }
];
