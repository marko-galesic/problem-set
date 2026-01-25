// Starts With Consonant test suite
//
// Test cases for startsWithConsonant(String s) method
// Returns boolean

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "Banana"',
    s: "Banana",
    expected: true
  },
{
    id: 2,
    name: "Case 2",
    input: 's = "Apple"',
    s: "Apple",
    expected: false
  },
{
    id: 3,
    name: "Case 3",
    input: 's = "1test"',
    s: "1test",
    expected: false
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
    input: 's = "Zebra"',
    s: "Zebra",
    expected: true
  }
];
