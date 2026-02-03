export const runTests = [
  {
    id: 1,
    name: "Basic path",
    input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
    beginWord: "hit",
    endWord: "cog",
    wordList: ["hot", "dot", "dog", "lot", "log", "cog"],
    expected: 5
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
    input: "beginWord = \"same\", endWord = \"same\", wordList = [\"same\",\"lame\"]",
    beginWord: "same",
    endWord: "same",
    wordList: ["same", "lame"],
    expected: 1
  }
];

export const submitTests = [
  {
    id: 1,
    name: "Basic path",
    input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
    beginWord: "hit",
    endWord: "cog",
    wordList: ["hot", "dot", "dog", "lot", "log", "cog"],
    expected: 5
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
    input: "beginWord = \"same\", endWord = \"same\", wordList = [\"same\",\"lame\"]",
    beginWord: "same",
    endWord: "same",
    wordList: ["same", "lame"],
    expected: 1
  },
  {
    id: 4,
    name: "Direct neighbor",
    input: "beginWord = \"a\", endWord = \"c\", wordList = [\"a\",\"b\",\"c\"]",
    beginWord: "a",
    endWord: "c",
    wordList: ["a", "b", "c"],
    expected: 2
  },
  {
    id: 5,
    name: "Empty list",
    input: "beginWord = \"a\", endWord = \"c\", wordList = []",
    beginWord: "a",
    endWord: "c",
    wordList: [],
    expected: 0
  }
];
