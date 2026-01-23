// Combination Sum test suite
//
// Test cases for combinationSum(int[] candidates, int target) method
// Returns int[][] with unique combinations that sum to target

export const runTests = [
  {
    id: 1,
    name: "Basic example",
    input: "candidates = [2, 3, 6, 7], target = 7",
    candidates: [2, 3, 6, 7],
    target: 7,
    expected: [[2, 2, 3], [7]]
  },
  {
    id: 2,
    name: "Multiple combinations",
    input: "candidates = [2, 3, 5], target = 8",
    candidates: [2, 3, 5],
    target: 8,
    expected: [[2, 2, 2, 2], [2, 3, 3], [3, 5]]
  },
  {
    id: 3,
    name: "No solution",
    input: "candidates = [2], target = 1",
    candidates: [2],
    target: 1,
    expected: []
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Single candidate repeated",
    input: "candidates = [3], target = 9",
    candidates: [3],
    target: 9,
    expected: [[3, 3, 3]]
  },
  {
    id: 5,
    name: "Duplicate candidates input",
    input: "candidates = [2, 3, 2, 7], target = 7",
    candidates: [2, 3, 2, 7],
    target: 7,
    expected: [[2, 2, 3], [7]]
  },
  {
    id: 6,
    name: "Multiple ways with even numbers",
    input: "candidates = [2, 4, 6, 8], target = 8",
    candidates: [2, 4, 6, 8],
    target: 8,
    expected: [[2, 2, 2, 2], [2, 2, 4], [2, 6], [4, 4], [8]]
  },
  {
    id: 7,
    name: "Candidate one enables many combos",
    input: "candidates = [1, 2], target = 4",
    candidates: [1, 2],
    target: 4,
    expected: [[1, 1, 1, 1], [1, 1, 2], [2, 2]]
  },
  {
    id: 8,
    name: "Unsorted candidates",
    input: "candidates = [5, 2, 3], target = 7",
    candidates: [5, 2, 3],
    target: 7,
    expected: [[2, 2, 3], [2, 5]]
  },
  {
    id: 9,
    name: "Target smaller than all candidates",
    input: "candidates = [4, 5, 6], target = 3",
    candidates: [4, 5, 6],
    target: 3,
    expected: []
  }
];
