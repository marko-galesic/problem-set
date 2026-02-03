export const runTests = [
  {
    id: 1,
    name: "Simple maze",
    input: "maze = [[0,0,0],[0,1,0],[0,0,0]], start = [0,0], destination = [2,2]",
    maze: [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
    start: [0, 0],
    destination: [2, 2],
    expected: 2
  },
  {
    id: 2,
    name: "No path",
    input: "maze = [[0,1,0],[1,1,1],[0,1,0]], start = [0,0], destination = [2,2]",
    maze: [[0, 1, 0], [1, 1, 1], [0, 1, 0]],
    start: [0, 0],
    destination: [2, 2],
    expected: -1
  },
  {
    id: 3,
    name: "Already at destination",
    input: "maze = [[0]], start = [0,0], destination = [0,0]",
    maze: [[0]],
    start: [0, 0],
    destination: [0, 0],
    expected: 0
  }
];

export const submitTests = [
  {
    id: 1,
    name: "Simple maze",
    input: "maze = [[0,0,0],[0,1,0],[0,0,0]], start = [0,0], destination = [2,2]",
    maze: [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
    start: [0, 0],
    destination: [2, 2],
    expected: 2
  },
  {
    id: 2,
    name: "No path",
    input: "maze = [[0,1,0],[1,1,1],[0,1,0]], start = [0,0], destination = [2,2]",
    maze: [[0, 1, 0], [1, 1, 1], [0, 1, 0]],
    start: [0, 0],
    destination: [2, 2],
    expected: -1
  },
  {
    id: 3,
    name: "Already at destination",
    input: "maze = [[0]], start = [0,0], destination = [0,0]",
    maze: [[0]],
    start: [0, 0],
    destination: [0, 0],
    expected: 0
  },
  {
    id: 4,
    name: "Multiple rolls",
    input: "maze = [[0,0,1],[0,0,0],[1,0,0]], start = [0,0], destination = [2,2]",
    maze: [[0, 0, 1], [0, 0, 0], [1, 0, 0]],
    start: [0, 0],
    destination: [2, 2],
    expected: 3
  }
];
