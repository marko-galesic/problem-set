// Best Time to Buy and Sell Stock test suite
//
// Test cases for maxProfit(int[] prices) method
// Returns int: maximum profit from buying and selling stock once

export const runTests = [
  {
    id: 1,
    name: "Basic example with profit",
    input: "prices = [7, 1, 5, 3, 6, 4]",
    prices: [7, 1, 5, 3, 6, 4],
    expected: 5
  },
  {
    id: 2,
    name: "Decreasing prices - no profit",
    input: "prices = [7, 6, 4, 3, 1]",
    prices: [7, 6, 4, 3, 1],
    expected: 0
  },
  {
    id: 3,
    name: "Two elements with profit",
    input: "prices = [1, 2]",
    prices: [1, 2],
    expected: 1
  }
];

export const submitTests = [
  ...runTests,
  
  {
    id: 4,
    name: "Single element",
    input: "prices = [1]",
    prices: [1],
    expected: 0
  },
  {
    id: 5,
    name: "Empty array",
    input: "prices = []",
    prices: [],
    expected: 0
  },
  {
    id: 6,
    name: "All prices same",
    input: "prices = [5, 5, 5, 5]",
    prices: [5, 5, 5, 5],
    expected: 0
  },
  {
    id: 7,
    name: "Buy at first, sell at last",
    input: "prices = [1, 2, 3, 4, 5]",
    prices: [1, 2, 3, 4, 5],
    expected: 4
  },
  {
    id: 8,
    name: "Multiple peaks and valleys",
    input: "prices = [2, 4, 1, 3, 5, 2, 6]",
    prices: [2, 4, 1, 3, 5, 2, 6],
    expected: 5
  },
  {
    id: 9,
    name: "Large profit scenario",
    input: "prices = [1, 100]",
    prices: [1, 100],
    expected: 99
  },
  {
    id: 10,
    name: "Minimum buy, maximum sell",
    input: "prices = [10, 1, 5, 20, 3, 15]",
    prices: [10, 1, 5, 20, 3, 15],
    expected: 19
  },
  {
    id: 11,
    name: "Profit in middle",
    input: "prices = [3, 2, 6, 5, 0, 3]",
    prices: [3, 2, 6, 5, 0, 3],
    expected: 4
  },
  {
    id: 12,
    name: "Increasing then decreasing",
    input: "prices = [1, 3, 5, 4, 2]",
    prices: [1, 3, 5, 4, 2],
    expected: 4
  },
  {
    id: 13,
    name: "Large array with profit",
    input: "prices = [7, 2, 5, 1, 3, 6, 4, 8, 9, 2]",
    prices: [7, 2, 5, 1, 3, 6, 4, 8, 9, 2],
    expected: 8
  },
  {
    id: 14,
    name: "Two elements decreasing",
    input: "prices = [2, 1]",
    prices: [2, 1],
    expected: 0
  }
];
