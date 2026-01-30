// Coin Change Min Coins test suite
//
// Test cases for coinChangeMinCoins(int[] coins, int amount)

export const runTests = [
  {
    "id": 1,
    "name": "Standard",
    "input": "coins = [1,2,5], amount = 11",
    "coins": [
      1,
      2,
      5
    ],
    "amount": 11,
    "expected": 3
  },
  {
    "id": 2,
    "name": "Impossible",
    "input": "coins = [2], amount = 3",
    "coins": [
      2
    ],
    "amount": 3,
    "expected": -1
  },
  {
    "id": 3,
    "name": "Zero amount",
    "input": "coins = [1], amount = 0",
    "coins": [
      1
    ],
    "amount": 0,
    "expected": 0
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "Another",
      "input": "coins = [1,3,4], amount = 6",
      "coins": [
        1,
        3,
        4
      ],
      "amount": 6,
      "expected": 2
    },
    {
      "id": 5,
      "name": "Impossible 2",
      "input": "coins = [2,4,10], amount = 7",
      "coins": [
        2,
        4,
        10
      ],
      "amount": 7,
      "expected": -1
    }
];
