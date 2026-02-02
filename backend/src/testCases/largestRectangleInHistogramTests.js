// Largest Rectangle in Histogram test suite
//
// Test cases for largestRectangleArea(int[] heights) method
// Returns int

export const runTests = [
  {
    id: 1,
    name: "Classic example",
    input: 'heights = [2,1,5,6,2,3]',
    heights: [2, 1, 5, 6, 2, 3],
    expected: 10
  },
  {
    id: 2,
    name: "Single bar",
    input: 'heights = [4]',
    heights: [4],
    expected: 4
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "Increasing bars",
    input: 'heights = [1,2,3,4,5]',
    heights: [1, 2, 3, 4, 5],
    expected: 9
  },
  {
    id: 4,
    name: "All same",
    input: 'heights = [2,2,2]',
    heights: [2, 2, 2],
    expected: 6
  }
];
