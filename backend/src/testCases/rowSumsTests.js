// Row Sums test suite
//
// Test cases for rowSums(int[][] matrix) method
// Returns intArray

export const runTests = [
  {
    id: 1,
    name: "Case 1",
    input: "matrix = [[1, 2, 3], [4, 5, 6]]",
    matrix: [[1, 2, 3], [4, 5, 6]],
    expected: [6, 15]
  },
  {
    id: 2,
    name: "Case 2",
    input: "matrix = [[1]]",
    matrix: [[1]],
    expected: [1]
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
    input: "matrix = [[0, -1], [2, -3]]",
    matrix: [[0, -1], [2, -3]],
    expected: [-1, -1]
  },
  {
    id: 5,
    name: "Case 5",
    input: "matrix = [[5, 5, 5]]",
    matrix: [[5, 5, 5]],
    expected: [15]
  }
];
