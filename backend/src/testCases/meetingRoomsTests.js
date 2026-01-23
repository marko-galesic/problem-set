// Meeting Rooms test suite
//
// Test cases for canAttendMeetings(int[][] intervals) method
// Returns boolean indicating if all meetings can be attended

export const runTests = [
  {
    id: 1,
    name: "Overlapping meetings",
    input: "intervals = [[0, 30], [5, 10], [15, 20]]",
    intervals: [
      [0, 30],
      [5, 10],
      [15, 20]
    ],
    expected: false
  },
  {
    id: 2,
    name: "No overlap",
    input: "intervals = [[5, 8], [9, 15]]",
    intervals: [
      [5, 8],
      [9, 15]
    ],
    expected: true
  },
  {
    id: 3,
    name: "Touching endpoints",
    input: "intervals = [[1, 2], [2, 3], [3, 4]]",
    intervals: [
      [1, 2],
      [2, 3],
      [3, 4]
    ],
    expected: true
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Single meeting",
    input: "intervals = [[7, 10]]",
    intervals: [[7, 10]],
    expected: true
  },
  {
    id: 5,
    name: "Unsorted overlap",
    input: "intervals = [[10, 12], [2, 6], [5, 9]]",
    intervals: [
      [10, 12],
      [2, 6],
      [5, 9]
    ],
    expected: false
  },
  {
    id: 6,
    name: "Nested meeting",
    input: "intervals = [[1, 10], [2, 3]]",
    intervals: [
      [1, 10],
      [2, 3]
    ],
    expected: false
  },
  {
    id: 7,
    name: "Empty list",
    input: "intervals = []",
    intervals: [],
    expected: true
  },
  {
    id: 8,
    name: "Same start time",
    input: "intervals = [[1, 4], [1, 2]]",
    intervals: [
      [1, 4],
      [1, 2]
    ],
    expected: false
  }
];
