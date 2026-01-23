// Last Character test suite
//
// Test cases for lastCharacter(String s) method
// Returns String

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "hello"',
    s: "hello",
    expected: "o"
  },
{
    id: 2,
    name: "Case 2",
    input: 's = ""',
    s: "",
    expected: ""
  },
{
    id: 3,
    name: "Case 3",
    input: 's = " A"',
    s: " A",
    expected: "A"
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 's = "x"',
    s: "x",
    expected: "x"
  },
{
    id: 5,
    name: "Case 5",
    input: 's = "end "',
    s: "end ",
    expected: " "
  }
];
