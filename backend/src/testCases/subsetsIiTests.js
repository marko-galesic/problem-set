// Subsets II test suite
//
// Test cases for subsetsWithDup(int[] nums) method
// Returns int[][] with unique subsets in lexicographic order

export const runTests = [
  {
    id: 1,
    name: "Basic duplicates",
    input: "nums = [1, 2, 2]",
    nums: [1, 2, 2],
    expected: [[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]
  },
  {
    id: 2,
    name: "Empty array",
    input: "nums = []",
    nums: [],
    expected: [[]]
  },
  {
    id: 3,
    name: "All duplicates",
    input: "nums = [2, 2, 2]",
    nums: [2, 2, 2],
    expected: [[], [2], [2, 2], [2, 2, 2]]
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Negatives and zero",
    input: "nums = [0, -1, -1, 2]",
    nums: [0, -1, -1, 2],
    expected: [
      [],
      [-1],
      [-1, -1],
      [-1, -1, 0],
      [-1, -1, 0, 2],
      [-1, -1, 2],
      [-1, 0],
      [-1, 0, 2],
      [-1, 2],
      [0],
      [0, 2],
      [2]
    ]
  },
  {
    id: 5,
    name: "Distinct values",
    input: "nums = [3, 1, 2]",
    nums: [3, 1, 2],
    expected: [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]
  },
  {
    id: 6,
    name: "Multiple duplicate groups",
    input: "nums = [1, 1, 2, 2]",
    nums: [1, 1, 2, 2],
    expected: [
      [],
      [1],
      [1, 1],
      [1, 1, 2],
      [1, 1, 2, 2],
      [1, 2],
      [1, 2, 2],
      [2],
      [2, 2]
    ]
  }
];
