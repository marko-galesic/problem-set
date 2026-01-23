// Word Search test suite
//
// Test cases for exist(char[][] board, String word) method
// Returns boolean indicating whether the word exists in the grid

export const runTests = [
  {
    id: 1,
    name: "Basic example - path exists",
    input: "board = [['A','B','C','E'], ['S','F','C','S'], ['A','D','E','E']], word = \"ABCCED\"",
    board: [
      ['A','B','C','E'],
      ['S','F','C','S'],
      ['A','D','E','E']
    ],
    word: "ABCCED",
    expected: true
  },
  {
    id: 2,
    name: "Basic example - second word",
    input: "board = [['A','B','C','E'], ['S','F','C','S'], ['A','D','E','E']], word = \"SEE\"",
    board: [
      ['A','B','C','E'],
      ['S','F','C','S'],
      ['A','D','E','E']
    ],
    word: "SEE",
    expected: true
  },
  {
    id: 3,
    name: "Word not present",
    input: "board = [['A','B','C','E'], ['S','F','C','S'], ['A','D','E','E']], word = \"ABCB\"",
    board: [
      ['A','B','C','E'],
      ['S','F','C','S'],
      ['A','D','E','E']
    ],
    word: "ABCB",
    expected: false
  },
  {
    id: 4,
    name: "Single cell match",
    input: "board = [['A']], word = \"A\"",
    board: [['A']],
    word: "A",
    expected: true
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 5,
    name: "Single cell mismatch",
    input: "board = [['A']], word = \"B\"",
    board: [['A']],
    word: "B",
    expected: false
  },
  {
    id: 6,
    name: "Diagonal not allowed",
    input: "board = [['A','B'], ['C','D']], word = \"AD\"",
    board: [
      ['A','B'],
      ['C','D']
    ],
    word: "AD",
    expected: false
  },
  {
    id: 7,
    name: "Backtracking required",
    input: "board = [['A','B','C','E'], ['S','F','E','S'], ['A','D','E','E']], word = \"ABCESEEEFS\"",
    board: [
      ['A','B','C','E'],
      ['S','F','E','S'],
      ['A','D','E','E']
    ],
    word: "ABCESEEEFS",
    expected: true
  },
  {
    id: 8,
    name: "Word longer than board",
    input: "board = [['A','B'], ['C','D']], word = \"ABCDE\"",
    board: [
      ['A','B'],
      ['C','D']
    ],
    word: "ABCDE",
    expected: false
  },
  {
    id: 9,
    name: "Cell reuse not allowed",
    input: "board = [['A','B'], ['C','D']], word = \"ABA\"",
    board: [
      ['A','B'],
      ['C','D']
    ],
    word: "ABA",
    expected: false
  }
];
