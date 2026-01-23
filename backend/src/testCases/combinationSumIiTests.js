// Combination Sum II test suite
//
// Test cases for combinationSum2(int[] candidates, int target) method
// Returns int[][] of unique combinations sorted lexicographically

export const runTests = [
  {
    id: 1,
    name: "Basic example",
    input: "candidates = [10, 1, 2, 7, 6, 1, 5], target = 8",
    candidates: [10, 1, 2, 7, 6, 1, 5],
    target: 8,
    expected: [
      [1, 1, 6],
      [1, 2, 5],
      [1, 7],
      [2, 6]
    ]
  },
  {
    id: 2,
    name: "Duplicates with single use",
    input: "candidates = [2, 5, 2, 1, 2], target = 5",
    candidates: [2, 5, 2, 1, 2],
    target: 5,
    expected: [
      [1, 2, 2],
      [5]
    ]
  },
  {
    id: 3,
    name: "No solution",
    input: "candidates = [3, 4, 7], target = 2",
    candidates: [3, 4, 7],
    target: 2,
    expected: []
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "All duplicates",
    input: "candidates = [1, 1, 1, 1], target = 2",
    candidates: [1, 1, 1, 1],
    target: 2,
    expected: [[1, 1]]
  },
  {
    id: 5,
    name: "Single candidate",
    input: "candidates = [4], target = 4",
    candidates: [4],
    target: 4,
    expected: [[4]]
  },
  {
    id: 6,
    name: "Multiple combinations",
    input: "candidates = [3, 1, 3, 5, 1, 1], target = 8",
    candidates: [3, 1, 3, 5, 1, 1],
    target: 8,
    expected: [
      [1, 1, 1, 5],
      [1, 1, 3, 3],
      [3, 5]
    ]
  }
];
