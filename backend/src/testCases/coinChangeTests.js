// Coin Change test suite
//
// Test cases for coinChange(int[] coins, int amount) method
// Returns int: minimum number of coins needed, or -1 if impossible

export const runTests = [
  {
    id: 1,
    name: "Basic example",
    input: "coins = [1, 2, 5], amount = 11",
    coins: [1, 2, 5],
    amount: 11,
    expected: 3
  },
  {
    id: 2,
    name: "Impossible case",
    input: "coins = [2], amount = 3",
    coins: [2],
    amount: 3,
    expected: -1
  },
  {
    id: 3,
    name: "Single coin needed",
    input: "coins = [1, 2, 5], amount = 5",
    coins: [1, 2, 5],
    amount: 5,
    expected: 1
  }
];

export const submitTests = [
  ...runTests,
  
  {
    id: 4,
    name: "Zero amount",
    input: "coins = [1, 2, 5], amount = 0",
    coins: [1, 2, 5],
    amount: 0,
    expected: 0
  },
  {
    id: 5,
    name: "Single coin type",
    input: "coins = [1], amount = 3",
    coins: [1],
    amount: 3,
    expected: 3
  },
  {
    id: 6,
    name: "Large amount",
    input: "coins = [1, 2, 5], amount = 100",
    coins: [1, 2, 5],
    amount: 100,
    expected: 20
  },
  {
    id: 7,
    name: "Unsorted coins",
    input: "coins = [5, 2, 1], amount = 11",
    coins: [5, 2, 1],
    amount: 11,
    expected: 3
  },
  {
    id: 8,
    name: "Multiple coin types needed",
    input: "coins = [1, 3, 4], amount = 6",
    coins: [1, 3, 4],
    amount: 6,
    expected: 2
  },
  {
    id: 9,
    name: "All coins larger than amount",
    input: "coins = [5, 10, 20], amount = 3",
    coins: [5, 10, 20],
    amount: 3,
    expected: -1
  },
  {
    id: 10,
    name: "Exact match with one coin",
    input: "coins = [1, 5, 10], amount = 10",
    coins: [1, 5, 10],
    amount: 10,
    expected: 1
  },
  {
    id: 11,
    name: "Greedy approach fails",
    input: "coins = [1, 3, 4], amount = 6",
    coins: [1, 3, 4],
    amount: 6,
    expected: 2
  },
  {
    id: 12,
    name: "Large coin denominations",
    input: "coins = [186, 419, 83, 408], amount = 6249",
    coins: [186, 419, 83, 408],
    amount: 6249,
    expected: 20
  },
  {
    id: 13,
    name: "Amount equals smallest coin",
    input: "coins = [2, 5, 10], amount = 2",
    coins: [2, 5, 10],
    amount: 2,
    expected: 1
  },
  {
    id: 14,
    name: "Multiple ways to make amount",
    input: "coins = [1, 2, 5], amount = 6",
    coins: [1, 2, 5],
    amount: 6,
    expected: 2
  },
  {
    id: 15,
    name: "Amount requires all coin types",
    input: "coins = [1, 2, 5], amount = 8",
    coins: [1, 2, 5],
    amount: 8,
    expected: 3
  },
  {
    id: 16,
    name: "Single coin type larger than amount",
    input: "coins = [5], amount = 2",
    coins: [5],
    amount: 2,
    expected: -1
  }
];
