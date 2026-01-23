// Non-Overlapping Intervals test suite
//
// Test cases for eraseOverlapIntervals(int[][] intervals) method
// Returns int representing minimum removals to eliminate overlaps

export const runTests = [
  {
    id: 1,
    name: "Basic overlap",
    input: "intervals = [[1,2],[2,3],[3,4],[1,3]]",
    intervals: [
      [1, 2],
      [2, 3],
      [3, 4],
      [1, 3]
    ],
    expected: 1
  },
  {
    id: 2,
    name: "All identical",
    input: "intervals = [[1,2],[1,2],[1,2]]",
    intervals: [
      [1, 2],
      [1, 2],
      [1, 2]
    ],
    expected: 2
  },
  {
    id: 3,
    name: "Already non-overlapping",
    input: "intervals = [[1,2],[2,3],[3,4]]",
    intervals: [
      [1, 2],
      [2, 3],
      [3, 4]
    ],
    expected: 0
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Single interval",
    input: "intervals = [[5,7]]",
    intervals: [[5, 7]],
    expected: 0
  },
  {
    id: 5,
    name: "Empty input",
    input: "intervals = []",
    intervals: [],
    expected: 0
  },
  {
    id: 6,
    name: "Nested intervals",
    input: "intervals = [[1,100],[11,22],[1,11],[2,12]]",
    intervals: [
      [1, 100],
      [11, 22],
      [1, 11],
      [2, 12]
    ],
    expected: 2
  },
  {
    id: 7,
    name: "Negative values",
    input: "intervals = [[-3,-1],[-2,1],[1,3]]",
    intervals: [
      [-3, -1],
      [-2, 1],
      [1, 3]
    ],
    expected: 1
  },
  {
    id: 8,
    name: "Mixed overlaps",
    input: "intervals = [[1,5],[2,3],[3,4],[4,6]]",
    intervals: [
      [1, 5],
      [2, 3],
      [3, 4],
      [4, 6]
    ],
    expected: 1
  }
];
