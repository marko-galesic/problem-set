// Isomorphic Strings test suite
//
// Test cases for isIsomorphic(String s, String t)

export const runTests = [
  {
    "id": 1,
    "name": "Isomorphic",
    "input": "s = \"egg\", t = \"add\"",
    "s": "egg",
    "t": "add",
    "expected": true
  },
  {
    "id": 2,
    "name": "Not isomorphic",
    "input": "s = \"foo\", t = \"bar\"",
    "s": "foo",
    "t": "bar",
    "expected": false
  },
  {
    "id": 3,
    "name": "Isomorphic",
    "input": "s = \"paper\", t = \"title\"",
    "s": "paper",
    "t": "title",
    "expected": true
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "Conflict",
      "input": "s = \"ab\", t = \"aa\"",
      "s": "ab",
      "t": "aa",
      "expected": false
    },
    {
      "id": 5,
      "name": "Empty",
      "input": "s = \"\", t = \"\"",
      "s": "",
      "t": "",
      "expected": true
    }
];
