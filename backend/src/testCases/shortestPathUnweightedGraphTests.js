export const runTests = [
  {
    id: 1,
    name: "Linear graph",
    input: "n = 5, edges = [[0,1],[1,2],[2,3],[3,4]], start = 0, end = 4",
    n: 5,
    edges: [[0, 1], [1, 2], [2, 3], [3, 4]],
    start: 0,
    end: 4,
    expected: 4
  },
  {
    id: 2,
    name: "Disconnected graph",
    input: "n = 4, edges = [[0,1],[2,3]], start = 0, end = 3",
    n: 4,
    edges: [[0, 1], [2, 3]],
    start: 0,
    end: 3,
    expected: -1
  },
  {
    id: 3,
    name: "Same node",
    input: "n = 3, edges = [[0,1]], start = 2, end = 2",
    n: 3,
    edges: [[0, 1]],
    start: 2,
    end: 2,
    expected: 0
  }
];

export const submitTests = [
  {
    id: 1,
    name: "Linear graph",
    input: "n = 5, edges = [[0,1],[1,2],[2,3],[3,4]], start = 0, end = 4",
    n: 5,
    edges: [[0, 1], [1, 2], [2, 3], [3, 4]],
    start: 0,
    end: 4,
    expected: 4
  },
  {
    id: 2,
    name: "Disconnected graph",
    input: "n = 4, edges = [[0,1],[2,3]], start = 0, end = 3",
    n: 4,
    edges: [[0, 1], [2, 3]],
    start: 0,
    end: 3,
    expected: -1
  },
  {
    id: 3,
    name: "Same node",
    input: "n = 3, edges = [[0,1]], start = 2, end = 2",
    n: 3,
    edges: [[0, 1]],
    start: 2,
    end: 2,
    expected: 0
  },
  {
    id: 4,
    name: "Branching graph",
    input: "n = 6, edges = [[0,1],[0,2],[1,3],[2,3],[3,4],[4,5]], start = 0, end = 5",
    n: 6,
    edges: [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [4, 5]],
    start: 0,
    end: 5,
    expected: 4
  }
];
