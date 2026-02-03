export const runTests = [
  {
    id: 1,
    name: "Leetcode example",
    input: "grid = [[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]], k = 1",
    grid: [[0, 0, 0], [1, 1, 0], [0, 0, 0], [0, 1, 1], [0, 0, 0]],
    k: 1,
    expected: 6
  },
  {
    id: 2,
    name: "Impossible with k",
    input: "grid = [[0,1,1],[1,1,0],[1,1,0]], k = 1",
    grid: [[0, 1, 1], [1, 1, 0], [1, 1, 0]],
    k: 1,
    expected: -1
  },
  {
    id: 3,
    name: "Single cell",
    input: "grid = [[0]], k = 0",
    grid: [[0]],
    k: 0,
    expected: 0
  }
];

export const submitTests = [
  {
    id: 1,
    name: "Leetcode example",
    input: "grid = [[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]], k = 1",
    grid: [[0, 0, 0], [1, 1, 0], [0, 0, 0], [0, 1, 1], [0, 0, 0]],
    k: 1,
    expected: 6
  },
  {
    id: 2,
    name: "Impossible with k",
    input: "grid = [[0,1,1],[1,1,0],[1,1,0]], k = 1",
    grid: [[0, 1, 1], [1, 1, 0], [1, 1, 0]],
    k: 1,
    expected: -1
  },
  {
    id: 3,
    name: "Single cell",
    input: "grid = [[0]], k = 0",
    grid: [[0]],
    k: 0,
    expected: 0
  },
  {
    id: 4,
    name: "Path without elimination",
    input: "grid = [[0,1,0],[0,1,0],[0,0,0]], k = 1",
    grid: [[0, 1, 0], [0, 1, 0], [0, 0, 0]],
    k: 1,
    expected: 4
  }
];
