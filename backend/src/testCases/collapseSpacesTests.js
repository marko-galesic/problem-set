// Collapse Spaces test suite
//
// Test cases for collapseSpaces(String s) method
// Returns String

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "  a   b  c "',
    s: "  a   b  c ",
    expected: "a b c"
  },
{
    id: 2,
    name: "Case 2",
    input: 's = "single"',
    s: "single",
    expected: "single"
  },
{
    id: 3,
    name: "Case 3",
    input: 's = "a    "',
    s: "a    ",
    expected: "a"
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 's = ""',
    s: "",
    expected: ""
  },
{
    id: 5,
    name: "Case 5",
    input: 's = "a  b"',
    s: "a  b",
    expected: "a b"
  }
];
