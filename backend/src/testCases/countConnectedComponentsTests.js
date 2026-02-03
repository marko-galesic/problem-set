export const runTests = [
  {
    id: 1,
    name: "Two components",
    input: "n = 5, edges = [[0,1],[1,2],[3,4]]",
    n: 5,
    edges: [[0, 1], [1, 2], [3, 4]],
    expected: 2
  },
  {
    id: 2,
    name: "Single component",
    input: "n = 4, edges = [[0,1],[1,2],[2,3]]",
    n: 4,
    edges: [[0, 1], [1, 2], [2, 3]],
    expected: 1
  },
  {
    id: 3,
    name: "No edges",
    input: "n = 3, edges = []",
    n: 3,
    edges: [],
    expected: 3
  }
];

export const submitTests = [
  {
    id: 1,
    name: "Two components",
    input: "n = 5, edges = [[0,1],[1,2],[3,4]]",
    n: 5,
    edges: [[0, 1], [1, 2], [3, 4]],
    expected: 2
  },
  {
    id: 2,
    name: "Single component",
    input: "n = 4, edges = [[0,1],[1,2],[2,3]]",
    n: 4,
    edges: [[0, 1], [1, 2], [2, 3]],
    expected: 1
  },
  {
    id: 3,
    name: "No edges",
    input: "n = 3, edges = []",
    n: 3,
    edges: [],
    expected: 3
  },
  {
    id: 4,
    name: "Zero nodes",
    input: "n = 0, edges = []",
    n: 0,
    edges: [],
    expected: 0
  }
];
