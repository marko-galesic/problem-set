// Subsets test suite
//
// Test cases for subsets(int[] nums) method
// Returns int[][] of all subsets in lexicographic order

export const runTests = [
  {
    id: 1,
    name: "Three elements",
    input: "nums = [1, 2, 3]",
    nums: [1, 2, 3],
    expected: [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]
  },
  {
    id: 2,
    name: "Unsorted input",
    input: "nums = [3, 1, 2]",
    nums: [3, 1, 2],
    expected: [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]
  },
  {
    id: 3,
    name: "Mixed signs",
    input: "nums = [-1, 0, 2]",
    nums: [-1, 0, 2],
    expected: [[], [-1], [-1, 0], [-1, 0, 2], [-1, 2], [0], [0, 2], [2]]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Single element",
    input: "nums = [5]",
    nums: [5],
    expected: [[], [5]]
  },
  {
    id: 5,
    name: "Two elements",
    input: "nums = [2, 1]",
    nums: [2, 1],
    expected: [[], [1], [1, 2], [2]]
  },
  {
    id: 6,
    name: "Empty input",
    input: "nums = []",
    nums: [],
    expected: [[]]
  },
  {
    id: 7,
    name: "Four elements",
    input: "nums = [1, 2, 3, 4]",
    nums: [1, 2, 3, 4],
    expected: [
      [],
      [1],
      [1, 2],
      [1, 2, 3],
      [1, 2, 3, 4],
      [1, 2, 4],
      [1, 3],
      [1, 3, 4],
      [1, 4],
      [2],
      [2, 3],
      [2, 3, 4],
      [2, 4],
      [3],
      [3, 4],
      [4]
    ]
  }
];
