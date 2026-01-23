// Container With Most Water test suite
//
// Test cases for maxArea(int[] height) method
// Returns int: maximum area formed by two lines

export const runTests = [
  {
    id: 1,
    name: "Classic example",
    input: "height = [1, 8, 6, 2, 5, 4, 8, 3, 7]",
    height: [1, 8, 6, 2, 5, 4, 8, 3, 7],
    expected: 49
  },
  {
    id: 2,
    name: "Two equal heights",
    input: "height = [1, 1]",
    height: [1, 1],
    expected: 1
  },
  {
    id: 3,
    name: "Symmetric tall ends",
    input: "height = [4, 3, 2, 1, 4]",
    height: [4, 3, 2, 1, 4],
    expected: 16
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Single element",
    input: "height = [5]",
    height: [5],
    expected: 0
  },
  {
    id: 5,
    name: "Empty array",
    input: "height = []",
    height: [],
    expected: 0
  },
  {
    id: 6,
    name: "Increasing heights",
    input: "height = [1, 2, 3, 4, 5]",
    height: [1, 2, 3, 4, 5],
    expected: 6
  },
  {
    id: 7,
    name: "Decreasing heights",
    input: "height = [5, 4, 3, 2, 1]",
    height: [5, 4, 3, 2, 1],
    expected: 6
  },
  {
    id: 8,
    name: "Peak near middle",
    input: "height = [2, 3, 10, 5, 7, 8, 9]",
    height: [2, 3, 10, 5, 7, 8, 9],
    expected: 36
  },
  {
    id: 9,
    name: "Small valley",
    input: "height = [1, 2, 1]",
    height: [1, 2, 1],
    expected: 2
  },
  {
    id: 10,
    name: "All equal",
    input: "height = [6, 6, 6, 6]",
    height: [6, 6, 6, 6],
    expected: 18
  }
];
