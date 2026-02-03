export const runTests = [
  {
    id: 1,
    name: "Bipartite",
    input: "graph = [[1,3],[0,2],[1,3],[0,2]]",
    graph: [[1, 3], [0, 2], [1, 3], [0, 2]],
    expected: true
  },
  {
    id: 2,
    name: "Not bipartite",
    input: "graph = [[1,2,3],[0,2],[0,1,3],[0,2]]",
    graph: [[1, 2, 3], [0, 2], [0, 1, 3], [0, 2]],
    expected: false
  },
  {
    id: 3,
    name: "Disconnected",
    input: "graph = [[1],[0],[],[4],[3]]",
    graph: [[1], [0], [], [4], [3]],
    expected: true
  }
];

export const submitTests = [
  {
    id: 1,
    name: "Bipartite",
    input: "graph = [[1,3],[0,2],[1,3],[0,2]]",
    graph: [[1, 3], [0, 2], [1, 3], [0, 2]],
    expected: true
  },
  {
    id: 2,
    name: "Not bipartite",
    input: "graph = [[1,2,3],[0,2],[0,1,3],[0,2]]",
    graph: [[1, 2, 3], [0, 2], [0, 1, 3], [0, 2]],
    expected: false
  },
  {
    id: 3,
    name: "Disconnected",
    input: "graph = [[1],[0],[],[4],[3]]",
    graph: [[1], [0], [], [4], [3]],
    expected: true
  },
  {
    id: 4,
    name: "Single node",
    input: "graph = [[]]",
    graph: [[]],
    expected: true
  }
];
