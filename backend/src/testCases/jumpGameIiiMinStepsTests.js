export const runTests = [
  {
    id: 1,
    name: "Example",
    input: "arr = [4,2,3,0,3,1,2], start = 5",
    arr: [4, 2, 3, 0, 3, 1, 2],
    start: 5,
    expected: 3
  },
  {
    id: 2,
    name: "Already zero",
    input: "arr = [0,1,2], start = 0",
    arr: [0, 1, 2],
    start: 0,
    expected: 0
  },
  {
    id: 3,
    name: "Unreachable",
    input: "arr = [3,0,2,1,2], start = 2",
    arr: [3, 0, 2, 1, 2],
    start: 2,
    expected: -1
  }
];

export const submitTests = [
  {
    id: 1,
    name: "Example",
    input: "arr = [4,2,3,0,3,1,2], start = 5",
    arr: [4, 2, 3, 0, 3, 1, 2],
    start: 5,
    expected: 3
  },
  {
    id: 2,
    name: "Already zero",
    input: "arr = [0,1,2], start = 0",
    arr: [0, 1, 2],
    start: 0,
    expected: 0
  },
  {
    id: 3,
    name: "Unreachable",
    input: "arr = [3,0,2,1,2], start = 2",
    arr: [3, 0, 2, 1, 2],
    start: 2,
    expected: -1
  },
  {
    id: 4,
    name: "Short path",
    input: "arr = [1,1,1,1,0], start = 2",
    arr: [1, 1, 1, 1, 0],
    start: 2,
    expected: 2
  }
];
