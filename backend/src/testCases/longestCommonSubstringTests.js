// Auto-generated test suite

export const runTests = [
  {
    "id": 1,
    "name": "Shared prefix",
    "input": "a = \"abcde\", b = \"abfce\"",
    "a": "abcde",
    "b": "abfce",
    "expected": 2
  },
  {
    "id": 2,
    "name": "No overlap",
    "input": "a = \"abcd\", b = \"efgh\"",
    "a": "abcd",
    "b": "efgh",
    "expected": 0
  },
  {
    "id": 3,
    "name": "Long overlap",
    "input": "a = \"banana\", b = \"ananas\"",
    "a": "banana",
    "b": "ananas",
    "expected": 5
  }
];

export const submitTests = [
  {
    "id": 1,
    "name": "Shared prefix",
    "input": "a = \"abcde\", b = \"abfce\"",
    "a": "abcde",
    "b": "abfce",
    "expected": 2
  },
  {
    "id": 2,
    "name": "No overlap",
    "input": "a = \"abcd\", b = \"efgh\"",
    "a": "abcd",
    "b": "efgh",
    "expected": 0
  },
  {
    "id": 3,
    "name": "Long overlap",
    "input": "a = \"banana\", b = \"ananas\"",
    "a": "banana",
    "b": "ananas",
    "expected": 5
  },
  {
    "id": 4,
    "name": "Empty string",
    "input": "a = \"\", b = \"abc\"",
    "a": "",
    "b": "abc",
    "expected": 0
  },
  {
    "id": 5,
    "name": "Identical strings",
    "input": "a = \"abc\", b = \"abc\"",
    "a": "abc",
    "b": "abc",
    "expected": 3
  },
  {
    "id": 6,
    "name": "Shifted overlap",
    "input": "a = \"ababc\", b = \"babca\"",
    "a": "ababc",
    "b": "babca",
    "expected": 4
  }
];
