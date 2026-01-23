// Insert Interval test suite
//
// Test cases for insert(int[][] intervals, int[] newInterval)
// Returns int[][] with merged intervals

export const runTests = [
  {
    id: 1,
    name: "Basic merge",
    input: "intervals = [[1, 3], [6, 9]], newInterval = [2, 5]",
    intervals: [[1, 3], [6, 9]],
    newInterval: [2, 5],
    expected: [[1, 5], [6, 9]]
  },
  {
    id: 2,
    name: "Merge multiple intervals",
    input: "intervals = [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], newInterval = [4, 8]",
    intervals: [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]],
    newInterval: [4, 8],
    expected: [[1, 2], [3, 10], [12, 16]]
  },
  {
    id: 3,
    name: "Empty intervals",
    input: "intervals = [], newInterval = [5, 7]",
    intervals: [],
    newInterval: [5, 7],
    expected: [[5, 7]]
  },
  {
    id: 4,
    name: "Contained interval",
    input: "intervals = [[1, 5]], newInterval = [2, 3]",
    intervals: [[1, 5]],
    newInterval: [2, 3],
    expected: [[1, 5]]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 5,
    name: "Insert before all",
    input: "intervals = [[3, 5], [7, 9]], newInterval = [1, 2]",
    intervals: [[3, 5], [7, 9]],
    newInterval: [1, 2],
    expected: [[1, 2], [3, 5], [7, 9]]
  },
  {
    id: 6,
    name: "Insert after all",
    input: "intervals = [[1, 2], [3, 5]], newInterval = [6, 7]",
    intervals: [[1, 2], [3, 5]],
    newInterval: [6, 7],
    expected: [[1, 2], [3, 5], [6, 7]]
  },
  {
    id: 7,
    name: "Merge across all",
    input: "intervals = [[1, 4], [5, 6], [7, 9]], newInterval = [2, 8]",
    intervals: [[1, 4], [5, 6], [7, 9]],
    newInterval: [2, 8],
    expected: [[1, 9]]
  },
  {
    id: 8,
    name: "Overlaps tail",
    input: "intervals = [[1, 2], [3, 4], [5, 7]], newInterval = [6, 8]",
    intervals: [[1, 2], [3, 4], [5, 7]],
    newInterval: [6, 8],
    expected: [[1, 2], [3, 4], [5, 8]]
  },
  {
    id: 9,
    name: "Touches boundaries",
    input: "intervals = [[1, 2], [4, 6]], newInterval = [2, 4]",
    intervals: [[1, 2], [4, 6]],
    newInterval: [2, 4],
    expected: [[1, 6]]
  },
  {
    id: 10,
    name: "Single interval insert",
    input: "intervals = [[2, 3]], newInterval = [4, 5]",
    intervals: [[2, 3]],
    newInterval: [4, 5],
    expected: [[2, 3], [4, 5]]
  }
];
