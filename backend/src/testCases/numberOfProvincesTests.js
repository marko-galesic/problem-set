// Number of Provinces test suite
//
// Test cases for findCircleNum(int[][] isConnected) method
// Returns int

export const runTests = [
  {
    id: 1,
    name: "Two provinces",
    input: 'isConnected = [[1,1,0],[1,1,0],[0,0,1]]',
    isConnected: [[1, 1, 0], [1, 1, 0], [0, 0, 1]],
    expected: 2
  },
  {
    id: 2,
    name: "Single province",
    input: 'isConnected = [[1,1,1],[1,1,1],[1,1,1]]',
    isConnected: [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
    expected: 1
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "All isolated",
    input: 'isConnected = [[1,0,0],[0,1,0],[0,0,1]]',
    isConnected: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    expected: 3
  },
  {
    id: 4,
    name: "Four nodes",
    input: 'isConnected = [[1,0,0,1],[0,1,1,0],[0,1,1,0],[1,0,0,1]]',
    isConnected: [
      [1, 0, 0, 1],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [1, 0, 0, 1]
    ],
    expected: 2
  }
];
