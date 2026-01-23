// Reverse Words test suite
//
// Test cases for reverseWords(String s) method
// Returns String

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "the sky is blue"',
    s: "the sky is blue",
    expected: "blue is sky the"
  },
{
    id: 2,
    name: "Case 2",
    input: 's = "  hello   world "',
    s: "  hello   world ",
    expected: "world hello"
  },
{
    id: 3,
    name: "Case 3",
    input: 's = "single"',
    s: "single",
    expected: "single"
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
    input: 's = "a b c"',
    s: "a b c",
    expected: "c b a"
  }
];
