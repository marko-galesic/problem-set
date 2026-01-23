// Rotting Oranges test suite
//
// Test cases for orangesRotting(int[][] grid) method
// Returns int representing minutes until all fresh oranges rot

export const runTests = [
  {
    id: 1,
    name: "Basic spread",
    input: "grid = [[2,1,1],[1,1,0],[0,1,1]]",
    grid: [
      [2, 1, 1],
      [1, 1, 0],
      [0, 1, 1]
    ],
    expected: 4
  },
  {
    id: 2,
    name: "Impossible to rot all",
    input: "grid = [[2,1,1],[0,1,1],[1,0,1]]",
    grid: [
      [2, 1, 1],
      [0, 1, 1],
      [1, 0, 1]
    ],
    expected: -1
  },
  {
    id: 3,
    name: "No fresh oranges",
    input: "grid = [[0,2]]",
    grid: [[0, 2]],
    expected: 0
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Single fresh orange",
    input: "grid = [[1]]",
    grid: [[1]],
    expected: -1
  },
  {
    id: 5,
    name: "All rotten",
    input: "grid = [[2,2],[2,2]]",
    grid: [
      [2, 2],
      [2, 2]
    ],
    expected: 0
  },
  {
    id: 6,
    name: "Multiple sources",
    input: "grid = [[2,1,1],[1,1,1],[0,1,2]]",
    grid: [
      [2, 1, 1],
      [1, 1, 1],
      [0, 1, 2]
    ],
    expected: 2
  },
  {
    id: 7,
    name: "Single row",
    input: "grid = [[1,2,1,1]]",
    grid: [[1, 2, 1, 1]],
    expected: 2
  },
  {
    id: 8,
    name: "Empty grid",
    input: "grid = []",
    grid: [],
    expected: 0
  }
];
