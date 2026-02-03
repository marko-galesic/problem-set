export const runTests = [
  {
    id: 1,
    name: "Two shortest paths",
    input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
    beginWord: "hit",
    endWord: "cog",
    wordList: ["hot", "dot", "dog", "lot", "log", "cog"],
    expected: 2
  },
  {
    id: 2,
    name: "No path",
    input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]",
    beginWord: "hit",
    endWord: "cog",
    wordList: ["hot", "dot", "dog", "lot", "log"],
    expected: 0
  },
  {
    id: 3,
    name: "Same word",
    input: "beginWord = \"same\", endWord = \"same\", wordList = [\"same\"]",
    beginWord: "same",
    endWord: "same",
    wordList: ["same"],
    expected: 1
  }
];

export const submitTests = [
  {
    id: 1,
    name: "Two shortest paths",
    input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
    beginWord: "hit",
    endWord: "cog",
    wordList: ["hot", "dot", "dog", "lot", "log", "cog"],
    expected: 2
  },
  {
    id: 2,
    name: "No path",
    input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]",
    beginWord: "hit",
    endWord: "cog",
    wordList: ["hot", "dot", "dog", "lot", "log"],
    expected: 0
  },
  {
    id: 3,
    name: "Same word",
    input: "beginWord = \"same\", endWord = \"same\", wordList = [\"same\"]",
    beginWord: "same",
    endWord: "same",
    wordList: ["same"],
    expected: 1
  },
  {
    id: 4,
    name: "Direct neighbor",
    input: "beginWord = \"a\", endWord = \"b\", wordList = [\"a\",\"b\"]",
    beginWord: "a",
    endWord: "b",
    wordList: ["a", "b"],
    expected: 1
  }
];
