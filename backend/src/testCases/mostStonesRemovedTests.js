// Most Stones Removed test suite
//
// Test cases for removeStones(int[][] stones) method
// Returns int

export const runTests = [
  {
    id: 1,
    name: "Classic example",
    input: 'stones = [[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]]',
    stones: [[0, 0], [0, 1], [1, 0], [1, 2], [2, 1], [2, 2]],
    expected: 5
  },
  {
    id: 2,
    name: "Single stone",
    input: 'stones = [[0,0]]',
    stones: [[0, 0]],
    expected: 0
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "All isolated",
    input: 'stones = [[0,0],[1,1],[2,2]]',
    stones: [[0, 0], [1, 1], [2, 2]],
    expected: 0
  },
  {
    id: 4,
    name: "Two components",
    input: 'stones = [[0,0],[0,1],[2,2],[2,3]]',
    stones: [[0, 0], [0, 1], [2, 2], [2, 3]],
    expected: 2
  }
];
