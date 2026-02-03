export const runTests = [
  {
    id: 1,
    name: "Portal shortcut",
    input: "grid = [[\"S\",\".\",\"a\"],[\"#\",\"#\",\".\"],[\"a\",\".\",\"E\"]]",
    grid: [["S", ".", "a"], ["#", "#", "."], ["a", ".", "E"]],
    expected: 4
  },
  {
    id: 2,
    name: "No portal",
    input: "grid = [[\"S\",\".\",\".\"],[\"#\",\"#\",\".\"],[\".\",\".\",\"E\"]]",
    grid: [["S", ".", "."], ["#", "#", "."], [".", ".", "E"]],
    expected: 4
  },
  {
    id: 3,
    name: "Unreachable",
    input: "grid = [[\"S\",\"#\",\"E\"]]",
    grid: [["S", "#", "E"]],
    expected: -1
  }
];

export const submitTests = [
  {
    id: 1,
    name: "Portal shortcut",
    input: "grid = [[\"S\",\".\",\"a\"],[\"#\",\"#\",\".\"],[\"a\",\".\",\"E\"]]",
    grid: [["S", ".", "a"], ["#", "#", "."], ["a", ".", "E"]],
    expected: 4
  },
  {
    id: 2,
    name: "No portal",
    input: "grid = [[\"S\",\".\",\".\"],[\"#\",\"#\",\".\"],[\".\",\".\",\"E\"]]",
    grid: [["S", ".", "."], ["#", "#", "."], [".", ".", "E"]],
    expected: 4
  },
  {
    id: 3,
    name: "Unreachable",
    input: "grid = [[\"S\",\"#\",\"E\"]]",
    grid: [["S", "#", "E"]],
    expected: -1
  },
  {
    id: 4,
    name: "Multiple portals",
    input: "grid = [[\"S\",\".\",\"a\",\".\",\"b\"],[\"#\",\"#\",\"#\",\".\",\"#\"],[\"a\",\".\",\"b\",\".\",\"E\"]]",
    grid: [["S", ".", "a", ".", "b"], ["#", "#", "#", ".", "#"], ["a", ".", "b", ".", "E"]],
    expected: 8
  }
];
