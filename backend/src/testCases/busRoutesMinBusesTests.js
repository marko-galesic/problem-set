export const runTests = [
  {
    id: 1,
    name: "Leetcode example",
    input: "routes = [[1,2,7],[3,6,7]], source = 1, target = 6",
    routes: [[1, 2, 7], [3, 6, 7]],
    source: 1,
    target: 6,
    expected: 2
  },
  {
    id: 2,
    name: "Same stop",
    input: "routes = [[1,2,3]], source = 2, target = 2",
    routes: [[1, 2, 3]],
    source: 2,
    target: 2,
    expected: 0
  },
  {
    id: 3,
    name: "Unreachable",
    input: "routes = [[1,2,3],[4,5,6]], source = 1, target = 6",
    routes: [[1, 2, 3], [4, 5, 6]],
    source: 1,
    target: 6,
    expected: -1
  }
];

export const submitTests = [
  {
    id: 1,
    name: "Leetcode example",
    input: "routes = [[1,2,7],[3,6,7]], source = 1, target = 6",
    routes: [[1, 2, 7], [3, 6, 7]],
    source: 1,
    target: 6,
    expected: 2
  },
  {
    id: 2,
    name: "Same stop",
    input: "routes = [[1,2,3]], source = 2, target = 2",
    routes: [[1, 2, 3]],
    source: 2,
    target: 2,
    expected: 0
  },
  {
    id: 3,
    name: "Unreachable",
    input: "routes = [[1,2,3],[4,5,6]], source = 1, target = 6",
    routes: [[1, 2, 3], [4, 5, 6]],
    source: 1,
    target: 6,
    expected: -1
  },
  {
    id: 4,
    name: "Multiple transfers",
    input: "routes = [[1,2,3],[3,4,5],[5,6]], source = 1, target = 6",
    routes: [[1, 2, 3], [3, 4, 5], [5, 6]],
    source: 1,
    target: 6,
    expected: 3
  }
];
