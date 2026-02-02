// Search Suggestions System test suite
//
// Test cases for suggestedProducts(String[] products, String searchWord) method
// Returns String[][]

export const runTests = [
  {
    id: 1,
    name: "Classic example",
    input: 'products = ["mobile","mouse","moneypot","monitor","mousepad"], searchWord = "mouse"',
    products: ["mobile", "mouse", "moneypot", "monitor", "mousepad"],
    searchWord: "mouse",
    expected: [
      ["mobile", "moneypot", "monitor"],
      ["mobile", "moneypot", "monitor"],
      ["mouse", "mousepad"],
      ["mouse", "mousepad"],
      ["mouse", "mousepad"]
    ]
  },
  {
    id: 2,
    name: "No suggestions",
    input: 'products = ["bags","baggage","banner"], searchWord = "cat"',
    products: ["bags", "baggage", "banner"],
    searchWord: "cat",
    expected: [[], [], []]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "Short search word",
    input: 'products = ["havana"], searchWord = "ha"',
    products: ["havana"],
    searchWord: "ha",
    expected: [["havana"], ["havana"]]
  },
  {
    id: 4,
    name: "More than three matches",
    input: 'products = ["a","aa","aaa","aaaa"], searchWord = "a"',
    products: ["a", "aa", "aaa", "aaaa"],
    searchWord: "a",
    expected: [["a", "aa", "aaa"]]
  }
];
