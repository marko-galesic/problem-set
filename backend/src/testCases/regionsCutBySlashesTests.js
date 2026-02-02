// Regions Cut By Slashes test suite
//
// Test cases for regionsBySlashes(String[] grid) method
// Returns int

export const runTests = [
  {
    id: 1,
    name: "Two regions",
    input: 'grid = [" /","/ "]',
    grid: [" /", "/ "],
    expected: 2
  },
  {
    id: 2,
    name: "Single region",
    input: 'grid = ["  ","  "]',
    grid: ["  ", "  "],
    expected: 1
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "Complex grid",
    input: 'grid = ["/\\","\\/"]',
    grid: ["/\\", "\\/"],
    expected: 5
  },
  {
    id: 4,
    name: "All slashes",
    input: 'grid = ["//","//"]',
    grid: ["//", "//"],
    expected: 4
  }
];
