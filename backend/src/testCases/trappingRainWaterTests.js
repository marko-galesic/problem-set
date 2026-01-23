// Trapping Rain Water test suite
//
// Test cases for trap(int[] height) method
// Returns int: total trapped water

export const runTests = [
  {
    id: 1,
    name: "Classic example",
    input: "height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]",
    height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
    expected: 6
  },
  {
    id: 2,
    name: "Wide basin",
    input: "height = [4, 2, 0, 3, 2, 5]",
    height: [4, 2, 0, 3, 2, 5],
    expected: 9
  },
  {
    id: 3,
    name: "Increasing heights",
    input: "height = [1, 2, 3, 4]",
    height: [1, 2, 3, 4],
    expected: 0
  },
  {
    id: 4,
    name: "Decreasing heights",
    input: "height = [4, 3, 2, 1]",
    height: [4, 3, 2, 1],
    expected: 0
  },
  {
    id: 5,
    name: "Small valley",
    input: "height = [2, 0, 2]",
    height: [2, 0, 2],
    expected: 2
  },
  {
    id: 6,
    name: "Plateau with dip",
    input: "height = [3, 3, 1, 3]",
    height: [3, 3, 1, 3],
    expected: 2
  },
  {
    id: 7,
    name: "Empty array",
    input: "height = []",
    height: [],
    expected: 0
  }
];

export const submitTests = [
  ...runTests
];
