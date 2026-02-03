export const runTests = [
  {
    id: 1,
    name: "Leetcode example",
    input: "arr = [100,-23,-23,404,100,23,23,23,3,404]",
    arr: [100, -23, -23, 404, 100, 23, 23, 23, 3, 404],
    expected: 3
  },
  {
    id: 2,
    name: "Single element",
    input: "arr = [7]",
    arr: [7],
    expected: 0
  },
  {
    id: 3,
    name: "Same value jump",
    input: "arr = [7,6,9,6,9,6,9,7]",
    arr: [7, 6, 9, 6, 9, 6, 9, 7],
    expected: 1
  }
];

export const submitTests = [
  {
    id: 1,
    name: "Leetcode example",
    input: "arr = [100,-23,-23,404,100,23,23,23,3,404]",
    arr: [100, -23, -23, 404, 100, 23, 23, 23, 3, 404],
    expected: 3
  },
  {
    id: 2,
    name: "Single element",
    input: "arr = [7]",
    arr: [7],
    expected: 0
  },
  {
    id: 3,
    name: "Same value jump",
    input: "arr = [7,6,9,6,9,6,9,7]",
    arr: [7, 6, 9, 6, 9, 6, 9, 7],
    expected: 1
  },
  {
    id: 4,
    name: "Simple forward",
    input: "arr = [6,1,9]",
    arr: [6, 1, 9],
    expected: 2
  }
];
