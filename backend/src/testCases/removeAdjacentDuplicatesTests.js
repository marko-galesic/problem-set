// Remove Adjacent Duplicates test suite
//
// Test cases for removeAdjacentDuplicates(String s)

export const runTests = [
  {
    "id": 1,
    "name": "Example",
    "input": "s = \"abbaca\"",
    "s": "abbaca",
    "expected": "ca"
  },
  {
    "id": 2,
    "name": "Mixed",
    "input": "s = \"azxxzy\"",
    "s": "azxxzy",
    "expected": "ay"
  },
  {
    "id": 3,
    "name": "Cascading",
    "input": "s = \"aabccba\"",
    "s": "aabccba",
    "expected": "a"
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "Empty",
      "input": "s = \"\"",
      "s": "",
      "expected": ""
    },
    {
      "id": 5,
      "name": "No duplicates",
      "input": "s = \"abcd\"",
      "s": "abcd",
      "expected": "abcd"
    }
];
