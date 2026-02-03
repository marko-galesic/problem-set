export const runTests = [
  {
    id: 1,
    name: "Mixed grid",
    input: "grid = [[1,0,1],[0,0,0],[1,0,1]]",
    grid: [[1, 0, 1], [0, 0, 0], [1, 0, 1]],
    expected: 2
  },
  {
    id: 2,
    name: "All land",
    input: "grid = [[1,1],[1,1]]",
    grid: [[1, 1], [1, 1]],
    expected: -1
  },
  {
    id: 3,
    name: "All water",
    input: "grid = [[0,0],[0,0]]",
    grid: [[0, 0], [0, 0]],
    expected: -1
  }
];

export const submitTests = [
  {
    id: 1,
    name: "Mixed grid",
    input: "grid = [[1,0,1],[0,0,0],[1,0,1]]",
    grid: [[1, 0, 1], [0, 0, 0], [1, 0, 1]],
    expected: 2
  },
  {
    id: 2,
    name: "All land",
    input: "grid = [[1,1],[1,1]]",
    grid: [[1, 1], [1, 1]],
    expected: -1
  },
  {
    id: 3,
    name: "All water",
    input: "grid = [[0,0],[0,0]]",
    grid: [[0, 0], [0, 0]],
    expected: -1
  },
  {
    id: 4,
    name: "Single land",
    input: "grid = [[1,0,0],[0,0,0],[0,0,0]]",
    grid: [[1, 0, 0], [0, 0, 0], [0, 0, 0]],
    expected: 4
  }
];
