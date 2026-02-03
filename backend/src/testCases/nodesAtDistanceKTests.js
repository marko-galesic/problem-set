export const runTests = [
  {
    id: 1,
    name: "Distance two",
    input: "n = 6, edges = [[0,1],[0,2],[1,3],[2,4],[4,5]], start = 0, k = 2",
    n: 6,
    edges: [[0, 1], [0, 2], [1, 3], [2, 4], [4, 5]],
    start: 0,
    k: 2,
    expected: [3, 4]
  },
  {
    id: 2,
    name: "Distance zero",
    input: "n = 3, edges = [[0,1],[1,2]], start = 1, k = 0",
    n: 3,
    edges: [[0, 1], [1, 2]],
    start: 1,
    k: 0,
    expected: [1]
  },
  {
    id: 3,
    name: "No nodes",
    input: "n = 3, edges = [[0,1]], start = 2, k = 1",
    n: 3,
    edges: [[0, 1]],
    start: 2,
    k: 1,
    expected: []
  }
];

export const submitTests = [
  {
    id: 1,
    name: "Distance two",
    input: "n = 6, edges = [[0,1],[0,2],[1,3],[2,4],[4,5]], start = 0, k = 2",
    n: 6,
    edges: [[0, 1], [0, 2], [1, 3], [2, 4], [4, 5]],
    start: 0,
    k: 2,
    expected: [3, 4]
  },
  {
    id: 2,
    name: "Distance zero",
    input: "n = 3, edges = [[0,1],[1,2]], start = 1, k = 0",
    n: 3,
    edges: [[0, 1], [1, 2]],
    start: 1,
    k: 0,
    expected: [1]
  },
  {
    id: 3,
    name: "No nodes",
    input: "n = 3, edges = [[0,1]], start = 2, k = 1",
    n: 3,
    edges: [[0, 1]],
    start: 2,
    k: 1,
    expected: []
  },
  {
    id: 4,
    name: "Larger k",
    input: "n = 5, edges = [[0,1],[1,2],[2,3],[3,4]], start = 0, k = 3",
    n: 5,
    edges: [[0, 1], [1, 2], [2, 3], [3, 4]],
    start: 0,
    k: 3,
    expected: [3]
  }
];
