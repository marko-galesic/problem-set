// Meeting Rooms II test suite
//
// Test cases for minMeetingRooms(int[][] intervals) method
// Returns int representing the minimum number of rooms needed

export const runTests = [
  {
    id: 1,
    name: "Basic overlap",
    input: "intervals = [[0,30],[5,10],[15,20]]",
    intervals: [
      [0, 30],
      [5, 10],
      [15, 20]
    ],
    expected: 2
  },
  {
    id: 2,
    name: "Back to back meetings",
    input: "intervals = [[1,2],[2,3],[3,4]]",
    intervals: [
      [1, 2],
      [2, 3],
      [3, 4]
    ],
    expected: 1
  },
  {
    id: 3,
    name: "Nested overlap",
    input: "intervals = [[1,5],[2,6],[4,8]]",
    intervals: [
      [1, 5],
      [2, 6],
      [4, 8]
    ],
    expected: 3
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Single meeting",
    input: "intervals = [[7,10]]",
    intervals: [[7, 10]],
    expected: 1
  },
  {
    id: 5,
    name: "Out of order",
    input: "intervals = [[7,10],[2,4]]",
    intervals: [
      [7, 10],
      [2, 4]
    ],
    expected: 1
  },
  {
    id: 6,
    name: "Same start time",
    input: "intervals = [[0,10],[0,5],[0,3]]",
    intervals: [
      [0, 10],
      [0, 5],
      [0, 3]
    ],
    expected: 3
  },
  {
    id: 7,
    name: "Empty list",
    input: "intervals = []",
    intervals: [],
    expected: 0
  }
];
