export const runTests = [
  {
    id: 1,
    name: "Basic maze",
    input: "maze = [[\"+\",\"+\",\".\",\"+\"],[\".\",\".\",\".\",\"+\"],[\"+\",\"+\",\"+\",\".\"]], entrance = [1,2]",
    maze: [["+", "+", ".", "+"], [".", ".", ".", "+"], ["+", "+", "+", "."]],
    entrance: [1, 2],
    expected: 1
  },
  {
    id: 2,
    name: "No exit",
    input: "maze = [[\"+\",\"+\",\"+\"],[\"+\",\".\",\"+\"],[\"+\",\"+\",\"+\"]], entrance = [1,1]",
    maze: [["+", "+", "+"], ["+", ".", "+"], ["+", "+", "+"]],
    entrance: [1, 1],
    expected: -1
  },
  {
    id: 3,
    name: "Entrance on boundary",
    input: "maze = [[\".\",\"+\"]], entrance = [0,0]",
    maze: [[".", "+"]],
    entrance: [0, 0],
    expected: -1
  }
];

export const submitTests = [
  {
    id: 1,
    name: "Basic maze",
    input: "maze = [[\"+\",\"+\",\".\",\"+\"],[\".\",\".\",\".\",\"+\"],[\"+\",\"+\",\"+\",\".\"]], entrance = [1,2]",
    maze: [["+", "+", ".", "+"], [".", ".", ".", "+"], ["+", "+", "+", "."]],
    entrance: [1, 2],
    expected: 1
  },
  {
    id: 2,
    name: "No exit",
    input: "maze = [[\"+\",\"+\",\"+\"],[\"+\",\".\",\"+\"],[\"+\",\"+\",\"+\"]], entrance = [1,1]",
    maze: [["+", "+", "+"], ["+", ".", "+"], ["+", "+", "+"]],
    entrance: [1, 1],
    expected: -1
  },
  {
    id: 3,
    name: "Entrance on boundary",
    input: "maze = [[\".\",\"+\"]], entrance = [0,0]",
    maze: [[".", "+"]],
    entrance: [0, 0],
    expected: -1
  },
  {
    id: 4,
    name: "Longer path",
    input: "maze = [[\"+\",\".\",\"+\"],[\"+\",\".\",\"+\"],[\"+\",\".\",\"+\"]], entrance = [1,1]",
    maze: [["+", ".", "+"], ["+", ".", "+"], ["+", ".", "+"]],
    entrance: [1, 1],
    expected: 1
  }
];
