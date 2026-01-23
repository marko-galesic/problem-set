// Starts With Capital test suite
//
// Test cases for startsWithCapital(String s) method
// Returns boolean

export const runTests = [
  {
    id: 1,
    name: "Case 1",
    input: "s = \"Hello\"",
    s: "Hello",
    expected: true
  },
  {
    id: 2,
    name: "Case 2",
    input: "s = \"hello\"",
    s: "hello",
    expected: false
  },
  {
    id: 3,
    name: "Case 3",
    input: "s = \"\"",
    s: "",
    expected: false
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Case 4",
    input: "s = \"A\"",
    s: "A",
    expected: true
  },
  {
    id: 5,
    name: "Case 5",
    input: "s = \"Zebra\"",
    s: "Zebra",
    expected: true
  }
];
