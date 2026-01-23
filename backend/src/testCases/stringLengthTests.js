// String Length test suite
//
// Test cases for stringLength(String s) method
// Returns int

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = ""',
    s: "",
    expected: 0
  },
{
    id: 2,
    name: "Case 2",
    input: 's = "A"',
    s: "A",
    expected: 1
  },
{
    id: 3,
    name: "Case 3",
    input: 's = "hello"',
    s: "hello",
    expected: 5
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 's = "a b"',
    s: "a b",
    expected: 3
  },
{
    id: 5,
    name: "Case 5",
    input: 's = "12345"',
    s: "12345",
    expected: 5
  }
];
