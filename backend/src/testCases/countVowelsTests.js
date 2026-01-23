// Count Vowels test suite
//
// Test cases for countVowels(String s) method
// Returns int

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "hello"',
    s: "hello",
    expected: 2
  },
{
    id: 2,
    name: "Case 2",
    input: 's = "rhythm"',
    s: "rhythm",
    expected: 0
  },
{
    id: 3,
    name: "Case 3",
    input: 's = "AEIOU"',
    s: "AEIOU",
    expected: 5
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 's = ""',
    s: "",
    expected: 0
  },
{
    id: 5,
    name: "Case 5",
    input: 's = "apple pie"',
    s: "apple pie",
    expected: 4
  }
];
