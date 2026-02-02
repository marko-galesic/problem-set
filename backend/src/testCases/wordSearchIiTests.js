// Word Search II test suite
//
// Test cases for findWords(char[][] board, String[] words) method
// Returns String[] sorted lexicographically

export const runTests = [
  {
    id: 1,
    name: "Classic example",
    input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]',
    board: [
      ['o', 'a', 'a', 'n'],
      ['e', 't', 'a', 'e'],
      ['i', 'h', 'k', 'r'],
      ['i', 'f', 'l', 'v']
    ],
    words: ["oath", "pea", "eat", "rain"],
    expected: ["eat", "oath"]
  },
  {
    id: 2,
    name: "Single row",
    input: 'board = [["a","b","c"]], words = ["ab","bc","abc","ac"]',
    board: [
      ['a', 'b', 'c']
    ],
    words: ["ab", "bc", "abc", "ac"],
    expected: ["ab", "abc", "bc"]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "Overlapping paths",
    input: 'board = [["a","b"],["c","d"]], words = ["abcd","acdb","adcb"]',
    board: [
      ['a', 'b'],
      ['c', 'd']
    ],
    words: ["abcd", "acdb", "adcb"],
    expected: ["acdb"]
  },
  {
    id: 4,
    name: "Repeated word list",
    input: 'board = [["a","a"],["a","a"]], words = ["a","aa","aaa","aaaa"]',
    board: [
      ['a', 'a'],
      ['a', 'a']
    ],
    words: ["a", "aa", "aaa", "aaaa"],
    expected: ["a", "aa", "aaa", "aaaa"]
  }
];
