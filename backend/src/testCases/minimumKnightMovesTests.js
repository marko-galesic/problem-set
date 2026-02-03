export const runTests = [
  {
    id: 1,
    name: "One move",
    input: "n = 8, start = [0,0], end = [1,2]",
    n: 8,
    start: [0, 0],
    end: [1, 2],
    expected: 1
  },
  {
    id: 2,
    name: "Corner to corner",
    input: "n = 8, start = [0,0], end = [7,7]",
    n: 8,
    start: [0, 0],
    end: [7, 7],
    expected: 6
  },
  {
    id: 3,
    name: "Same start and end",
    input: "n = 8, start = [3,3], end = [3,3]",
    n: 8,
    start: [3, 3],
    end: [3, 3],
    expected: 0
  }
];

export const submitTests = [
  {
    id: 1,
    name: "One move",
    input: "n = 8, start = [0,0], end = [1,2]",
    n: 8,
    start: [0, 0],
    end: [1, 2],
    expected: 1
  },
  {
    id: 2,
    name: "Corner to corner",
    input: "n = 8, start = [0,0], end = [7,7]",
    n: 8,
    start: [0, 0],
    end: [7, 7],
    expected: 6
  },
  {
    id: 3,
    name: "Same start and end",
    input: "n = 8, start = [3,3], end = [3,3]",
    n: 8,
    start: [3, 3],
    end: [3, 3],
    expected: 0
  },
  {
    id: 4,
    name: "Small board",
    input: "n = 4, start = [0,0], end = [3,3]",
    n: 4,
    start: [0, 0],
    end: [3, 3],
    expected: 2
  }
];
