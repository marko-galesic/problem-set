export const runTests = [
  {
    id: 1,
    name: "Simple graph",
    input: "n = 5, edges = [[0,1],[1,2],[2,3],[3,4]], source = 0",
    n: 5,
    edges: [[0, 1], [1, 2], [2, 3], [3, 4]],
    source: 0,
    expected: [0, 1, 2, 3, 4]
  },
  {
    id: 2,
    name: "Disconnected",
    input: "n = 4, edges = [[0,1],[2,3]], source = 0",
    n: 4,
    edges: [[0, 1], [2, 3]],
    source: 0,
    expected: [0, 1, -1, -1]
  },
  {
    id: 3,
    name: "Single node",
    input: "n = 1, edges = [], source = 0",
    n: 1,
    edges: [],
    source: 0,
    expected: [0]
  }
];

export const submitTests = [
  {
    id: 1,
    name: "Simple graph",
    input: "n = 5, edges = [[0,1],[1,2],[2,3],[3,4]], source = 0",
    n: 5,
    edges: [[0, 1], [1, 2], [2, 3], [3, 4]],
    source: 0,
    expected: [0, 1, 2, 3, 4]
  },
  {
    id: 2,
    name: "Disconnected",
    input: "n = 4, edges = [[0,1],[2,3]], source = 0",
    n: 4,
    edges: [[0, 1], [2, 3]],
    source: 0,
    expected: [0, 1, -1, -1]
  },
  {
    id: 3,
    name: "Single node",
    input: "n = 1, edges = [], source = 0",
    n: 1,
    edges: [],
    source: 0,
    expected: [0]
  },
  {
    id: 4,
    name: "Branching",
    input: "n = 6, edges = [[0,1],[0,2],[1,3],[2,4],[4,5]], source = 0",
    n: 6,
    edges: [[0, 1], [0, 2], [1, 3], [2, 4], [4, 5]],
    source: 0,
    expected: [0, 1, 1, 2, 2, 3]
  }
];
