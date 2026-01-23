// Only Letters test suite
//
// Test cases for onlyLetters(String s) method
// Returns String

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "a1b2"',
    s: "a1b2",
    expected: "ab"
  },
{
    id: 2,
    name: "Case 2",
    input: 's = "Hello, World!"',
    s: "Hello, World!",
    expected: "HelloWorld"
  },
{
    id: 3,
    name: "Case 3",
    input: 's = "123"',
    s: "123",
    expected: ""
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
    input: 's = "Mix3d-UP"',
    s: "Mix3d-UP",
    expected: "MixdUP"
  }
];
