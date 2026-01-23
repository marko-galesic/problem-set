// Replace Vowels With Star test suite
//
// Test cases for replaceVowelsWithStar(String s) method
// Returns String

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "hello"',
    s: "hello",
    expected: "h*ll*"
  },
{
    id: 2,
    name: "Case 2",
    input: 's = "AEIOU"',
    s: "AEIOU",
    expected: "*****"
  },
{
    id: 3,
    name: "Case 3",
    input: 's = "rhythm"',
    s: "rhythm",
    expected: "rhythm"
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
    input: 's = "Apple Pie"',
    s: "Apple Pie",
    expected: "*ppl* P**"
  }
];
