export const runTests = [
  {
    id: 1,
    name: "Small path",
    input: "grid = [[0,1],[0,0]]",
    grid: [[0, 1], [0, 0]],
    expected: 2
  },
  {
    id: 2,
    name: "Blocked start",
    input: "grid = [[1,0],[0,0]]",
    grid: [[1, 0], [0, 0]],
    expected: -1
  },
  {
    id: 3,
    name: "Single cell",
    input: "grid = [[0]]",
    grid: [[0]],
    expected: 0
  }
];

export const submitTests = [
  {
    id: 1,
    name: "Small path",
    input: "grid = [[0,1],[0,0]]",
    grid: [[0, 1], [0, 0]],
    expected: 2
  },
  {
    id: 2,
    name: "Blocked start",
    input: "grid = [[1,0],[0,0]]",
    grid: [[1, 0], [0, 0]],
    expected: -1
  },
  {
    id: 3,
    name: "Single cell",
    input: "grid = [[0]]",
    grid: [[0]],
    expected: 0
  },
  {
    id: 4,
    name: "Larger grid",
    input: "grid = [[0,0,0],[1,1,0],[1,1,0]]",
    grid: [[0, 0, 0], [1, 1, 0], [1, 1, 0]],
    expected: 4
  }
];
