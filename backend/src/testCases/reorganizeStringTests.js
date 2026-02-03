// Auto-generated test suite

export const runTests = [
  {
    "id": 1,
    "name": "Simple possible",
    "input": "s = \"aab\"",
    "s": "aab",
    "expected": "aba"
  },
  {
    "id": 2,
    "name": "Impossible",
    "input": "s = \"aaab\"",
    "s": "aaab",
    "expected": ""
  },
  {
    "id": 3,
    "name": "Multiple characters",
    "input": "s = \"vvvlo\"",
    "s": "vvvlo",
    "expected": "vlvov"
  }
];

export const submitTests = [
  {
    "id": 1,
    "name": "Simple possible",
    "input": "s = \"aab\"",
    "s": "aab",
    "expected": "aba"
  },
  {
    "id": 2,
    "name": "Impossible",
    "input": "s = \"aaab\"",
    "s": "aaab",
    "expected": ""
  },
  {
    "id": 3,
    "name": "Multiple characters",
    "input": "s = \"vvvlo\"",
    "s": "vvvlo",
    "expected": "vlvov"
  },
  {
    "id": 4,
    "name": "Balanced counts",
    "input": "s = \"aaabc\"",
    "s": "aaabc",
    "expected": "abaca"
  },
  {
    "id": 5,
    "name": "Even counts",
    "input": "s = \"aabbcc\"",
    "s": "aabbcc",
    "expected": "abacbc"
  },
  {
    "id": 6,
    "name": "Single char",
    "input": "s = \"a\"",
    "s": "a",
    "expected": "a"
  }
];
