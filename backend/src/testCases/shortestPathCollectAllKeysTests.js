export const runTests = [
  {
    id: 1,
    name: "Two keys",
    input: "grid = [[\"@\",\".\",\"a\",\".\",\"#\"],[\"#\",\"#\",\"#\",\".\",\"#\"],[\"b\",\".\",\".\",\".\",\".\"]]",
    grid: [["@", ".", "a", ".", "#"], ["#", "#", "#", ".", "#"], ["b", ".", ".", ".", "."]],
    expected: 8
  },
  {
    id: 2,
    name: "With lock",
    input: "grid = [[\"@\",\"a\",\"A\",\"b\"]]",
    grid: [["@", "a", "A", "b"]],
    expected: 3
  },
  {
    id: 3,
    name: "No keys",
    input: "grid = [[\"@\",\".\"]]",
    grid: [["@", "."]],
    expected: 0
  }
];

export const submitTests = [
  {
    id: 1,
    name: "Two keys",
    input: "grid = [[\"@\",\".\",\"a\",\".\",\"#\"],[\"#\",\"#\",\"#\",\".\",\"#\"],[\"b\",\".\",\".\",\".\",\".\"]]",
    grid: [["@", ".", "a", ".", "#"], ["#", "#", "#", ".", "#"], ["b", ".", ".", ".", "."]],
    expected: 8
  },
  {
    id: 2,
    name: "With lock",
    input: "grid = [[\"@\",\"a\",\"A\",\"b\"]]",
    grid: [["@", "a", "A", "b"]],
    expected: 3
  },
  {
    id: 3,
    name: "No keys",
    input: "grid = [[\"@\",\".\"]]",
    grid: [["@", "."]],
    expected: 0
  },
  {
    id: 4,
    name: "Impossible",
    input: "grid = [[\"@\",\"A\"],[\"#\",\"a\"]]",
    grid: [["@", "A"], ["#", "a"]],
    expected: -1
  }
];
