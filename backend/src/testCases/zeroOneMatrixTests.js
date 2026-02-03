export const runTests = [
  {
    id: 1,
    name: "Example",
    input: "mat = [[0,0,0],[0,1,0],[1,1,1]]",
    mat: [[0, 0, 0], [0, 1, 0], [1, 1, 1]],
    expected: [[0, 0, 0], [0, 1, 0], [1, 2, 1]]
  },
  {
    id: 2,
    name: "Single zero corner",
    input: "mat = [[0,1,1],[1,1,1]]",
    mat: [[0, 1, 1], [1, 1, 1]],
    expected: [[0, 1, 2], [1, 2, 3]]
  },
  {
    id: 3,
    name: "Single cell",
    input: "mat = [[0]]",
    mat: [[0]],
    expected: [[0]]
  }
];

export const submitTests = [
  {
    id: 1,
    name: "Example",
    input: "mat = [[0,0,0],[0,1,0],[1,1,1]]",
    mat: [[0, 0, 0], [0, 1, 0], [1, 1, 1]],
    expected: [[0, 0, 0], [0, 1, 0], [1, 2, 1]]
  },
  {
    id: 2,
    name: "Single zero corner",
    input: "mat = [[0,1,1],[1,1,1]]",
    mat: [[0, 1, 1], [1, 1, 1]],
    expected: [[0, 1, 2], [1, 2, 3]]
  },
  {
    id: 3,
    name: "Single cell",
    input: "mat = [[0]]",
    mat: [[0]],
    expected: [[0]]
  },
  {
    id: 4,
    name: "Row of zeros",
    input: "mat = [[1,1,1],[0,0,0]]",
    mat: [[1, 1, 1], [0, 0, 0]],
    expected: [[1, 1, 1], [0, 0, 0]]
  }
];
