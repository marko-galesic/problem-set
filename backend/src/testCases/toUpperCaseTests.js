// To Upper Case test suite
//
// Test cases for toUpperCase(String s) method
// Returns String

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "Hello"',
    s: "Hello",
    expected: "HELLO"
  },
{
    id: 2,
    name: "Case 2",
    input: 's = "already"',
    s: "already",
    expected: "ALREADY"
  },
{
    id: 3,
    name: "Case 3",
    input: 's = "MIXED123"',
    s: "MIXED123",
    expected: "MIXED123"
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
    input: 's = "a b"',
    s: "a b",
    expected: "A B"
  }
];
