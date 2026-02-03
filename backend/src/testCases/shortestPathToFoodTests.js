export const runTests = [
  {
    id: 1,
    name: "Example",
    input: "grid = [[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"*\",\"O\",\"O\",\"O\",\"X\"],[\"X\",\"O\",\"O\",\"#\",\"O\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"]]",
    grid: [["X", "X", "X", "X", "X", "X"], ["X", "*", "O", "O", "O", "X"], ["X", "O", "O", "#", "O", "X"], ["X", "X", "X", "X", "X", "X"]],
    expected: 3
  },
  {
    id: 2,
    name: "Adjacent food",
    input: "grid = [[\"*\",\"#\"]]",
    grid: [["*", "#"]],
    expected: 1
  },
  {
    id: 3,
    name: "No food",
    input: "grid = [[\"*\",\"O\"],[\"X\",\"O\"]]",
    grid: [["*", "O"], ["X", "O"]],
    expected: -1
  }
];

export const submitTests = [
  {
    id: 1,
    name: "Example",
    input: "grid = [[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"*\",\"O\",\"O\",\"O\",\"X\"],[\"X\",\"O\",\"O\",\"#\",\"O\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"]]",
    grid: [["X", "X", "X", "X", "X", "X"], ["X", "*", "O", "O", "O", "X"], ["X", "O", "O", "#", "O", "X"], ["X", "X", "X", "X", "X", "X"]],
    expected: 3
  },
  {
    id: 2,
    name: "Adjacent food",
    input: "grid = [[\"*\",\"#\"]]",
    grid: [["*", "#"]],
    expected: 1
  },
  {
    id: 3,
    name: "No food",
    input: "grid = [[\"*\",\"O\"],[\"X\",\"O\"]]",
    grid: [["*", "O"], ["X", "O"]],
    expected: -1
  },
  {
    id: 4,
    name: "Single row",
    input: "grid = [[\"*\",\"O\",\"#\"]]",
    grid: [["*", "O", "#"]],
    expected: 2
  }
];
