// Valid Mountain Array test suite
//
// Test cases for validMountainArray(int[] arr) method
// Returns boolean: true if arr is a valid mountain array

export const runTests = [
  {
    id: 1,
    name: "Too short descending",
    input: "arr = [2, 1]",
    arr: [2, 1],
    expected: false
  },
  {
    id: 2,
    name: "Plateau at peak",
    input: "arr = [3, 5, 5]",
    arr: [3, 5, 5],
    expected: false
  },
  {
    id: 3,
    name: "Simple mountain",
    input: "arr = [0, 3, 2, 1]",
    arr: [0, 3, 2, 1],
    expected: true
  },
  {
    id: 4,
    name: "Plateau in ascent",
    input: "arr = [0, 2, 3, 3, 5, 2, 1]",
    arr: [0, 2, 3, 3, 5, 2, 1],
    expected: false
  },
  {
    id: 5,
    name: "Short mountain",
    input: "arr = [1, 3, 2]",
    arr: [1, 3, 2],
    expected: true
  },
  {
    id: 6,
    name: "Monotonic increasing",
    input: "arr = [1, 2, 3, 4, 5]",
    arr: [1, 2, 3, 4, 5],
    expected: false
  }
];

export const submitTests = [
  ...runTests
];
