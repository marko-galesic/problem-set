// Count Positive In Matrix test suite
//
// Test cases for countPositiveInMatrix(int[][] matrix) method
// Returns int

export const runTests = [
  {
    id: 1,
    name: "Case 1",
    input: "matrix = [[1, -2, 3], [0, 4, -5]]",
    matrix: [[1, -2, 3], [0, 4, -5]],
    expected: 3
  },
  {
    id: 2,
    name: "Case 2",
    input: "matrix = [[-1, -2], [-3, -4]]",
    matrix: [[-1, -2], [-3, -4]],
    expected: 0
  },
  {
    id: 3,
    name: "Case 3",
    input: "matrix = []",
    matrix: [],
    expected: 0
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Case 4",
    input: "matrix = [[0, 0], [0, 1]]",
    matrix: [[0, 0], [0, 1]],
    expected: 1
  },
  {
    id: 5,
    name: "Case 5",
    input: "matrix = [[5]]",
    matrix: [[5]],
    expected: 1
  }
];
