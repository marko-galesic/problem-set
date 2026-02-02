// Redundant Connection test suite
//
// Test cases for findRedundantConnection(int[][] edges) method
// Returns int[]

export const runTests = [
  {
    id: 1,
    name: "Simple cycle",
    input: 'edges = [[1,2],[1,3],[2,3]]',
    edges: [[1, 2], [1, 3], [2, 3]],
    expected: [2, 3]
  },
  {
    id: 2,
    name: "Longer chain with extra edge",
    input: 'edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]',
    edges: [[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]],
    expected: [1, 4]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "Last edge is redundant",
    input: 'edges = [[1,2],[2,3],[3,1]]',
    edges: [[1, 2], [2, 3], [3, 1]],
    expected: [3, 1]
  },
  {
    id: 4,
    name: "Redundant edge late",
    input: 'edges = [[1,2],[2,3],[3,4],[1,4],[1,5],[2,5]]',
    edges: [[1, 2], [2, 3], [3, 4], [1, 4], [1, 5], [2, 5]],
    expected: [2, 5]
  }
];
