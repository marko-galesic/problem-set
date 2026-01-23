// Ends With Exclamation test suite
//
// Test cases for endsWithExclamation(String s) method
// Returns boolean

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "Hi!"',
    s: "Hi!",
    expected: true
  },
{
    id: 2,
    name: "Case 2",
    input: 's = "Hi"',
    s: "Hi",
    expected: false
  },
{
    id: 3,
    name: "Case 3",
    input: 's = "!"',
    s: "!",
    expected: true
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 's = ""',
    s: "",
    expected: false
  },
{
    id: 5,
    name: "Case 5",
    input: 's = "Wow!!"',
    s: "Wow!!",
    expected: true
  }
];
