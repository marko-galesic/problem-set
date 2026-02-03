export const runTests = [
  {
    id: 1,
    name: "Basic distances",
    input: "words = [\"hot\",\"dot\",\"dog\",\"lot\"], start = \"hot\"",
    words: ["hot", "dot", "dog", "lot"],
    start: "hot",
    expected: [0, 1, 2, 1]
  },
  {
    id: 2,
    name: "Unreachable word",
    input: "words = [\"cat\",\"cot\",\"dog\"], start = \"cat\"",
    words: ["cat", "cot", "dog"],
    start: "cat",
    expected: [0, 1, -1]
  },
  {
    id: 3,
    name: "Start missing",
    input: "words = [\"a\",\"b\"], start = \"c\"",
    words: ["a", "b"],
    start: "c",
    expected: [-1, -1]
  }
];

export const submitTests = [
  {
    id: 1,
    name: "Basic distances",
    input: "words = [\"hot\",\"dot\",\"dog\",\"lot\"], start = \"hot\"",
    words: ["hot", "dot", "dog", "lot"],
    start: "hot",
    expected: [0, 1, 2, 1]
  },
  {
    id: 2,
    name: "Unreachable word",
    input: "words = [\"cat\",\"cot\",\"dog\"], start = \"cat\"",
    words: ["cat", "cot", "dog"],
    start: "cat",
    expected: [0, 1, -1]
  },
  {
    id: 3,
    name: "Start missing",
    input: "words = [\"a\",\"b\"], start = \"c\"",
    words: ["a", "b"],
    start: "c",
    expected: [-1, -1]
  },
  {
    id: 4,
    name: "Same length cluster",
    input: "words = [\"abc\",\"abd\",\"acc\",\"xyz\"], start = \"abc\"",
    words: ["abc", "abd", "acc", "xyz"],
    start: "abc",
    expected: [0, 1, 1, -1]
  }
];
