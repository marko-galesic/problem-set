// Stream of Characters test suite
//
// Test cases for streamQueries(String[] words, String[] queries) method
// Returns int[]

export const runTests = [
  {
    id: 1,
    name: "Basic suffix matches",
    input: 'words = ["cd","f","kl"], queries = ["a","b","c","d","e","f"]',
    words: ["cd", "f", "kl"],
    queries: ["a", "b", "c", "d", "e", "f"],
    expected: [0, 0, 0, 1, 0, 1]
  },
  {
    id: 2,
    name: "Single letter words",
    input: 'words = ["a","b"], queries = ["a","a","b"]',
    words: ["a", "b"],
    queries: ["a", "a", "b"],
    expected: [1, 1, 1]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "Longer stream window",
    input: 'words = ["xyz","yz"], queries = ["x","y","z","y","z"]',
    words: ["xyz", "yz"],
    queries: ["x", "y", "z", "y", "z"],
    expected: [0, 0, 1, 0, 1]
  },
  {
    id: 4,
    name: "No matches",
    input: 'words = ["aa"], queries = ["b","b","b"]',
    words: ["aa"],
    queries: ["b", "b", "b"],
    expected: [0, 0, 0]
  }
];
