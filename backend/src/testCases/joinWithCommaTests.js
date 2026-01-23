// Join With Comma test suite
//
// Test cases for joinWithComma(String[] words) method
// Returns string

export const runTests = [
  {
    id: 1,
    name: "Case 1",
    input: "words = [\"a\", \"b\", \"c\"]",
    words: ["a", "b", "c"],
    expected: "a,b,c"
  },
  {
    id: 2,
    name: "Case 2",
    input: "words = []",
    words: [],
    expected: ""
  },
  {
    id: 3,
    name: "Case 3",
    input: "words = [\"hello\"]",
    words: ["hello"],
    expected: "hello"
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Case 4",
    input: "words = [\"one\", \"two\"]",
    words: ["one", "two"],
    expected: "one,two"
  },
  {
    id: 5,
    name: "Case 5",
    input: "words = [\"x\", \"y\", \"z\", \"w\"]",
    words: ["x", "y", "z", "w"],
    expected: "x,y,z,w"
  }
];
