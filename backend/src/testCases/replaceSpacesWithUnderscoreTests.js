// Replace Spaces With Underscore test suite
//
// Test cases for replaceSpacesWithUnderscore(String s) method
// Returns string

export const runTests = [
  {
    id: 1,
    name: "Case 1",
    input: "s = \"hello world\"",
    s: "hello world",
    expected: "hello_world"
  },
  {
    id: 2,
    name: "Case 2",
    input: "s = \"\"",
    s: "",
    expected: ""
  },
  {
    id: 3,
    name: "Case 3",
    input: "s = \"single\"",
    s: "single",
    expected: "single"
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Case 4",
    input: "s = \"  multiple   spaces  \"",
    s: "  multiple   spaces  ",
    expected: "__multiple___spaces__"
  },
  {
    id: 5,
    name: "Case 5",
    input: "s = \"a b c\"",
    s: "a b c",
    expected: "a_b_c"
  }
];
