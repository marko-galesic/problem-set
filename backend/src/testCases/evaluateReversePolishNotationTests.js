// Evaluate Reverse Polish Notation test suite
//
// Test cases for evalRPN(tokens) method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Multiplication after addition",
    "input": "tokens = [\"2\", \"1\", \"+\", \"3\", \"*\"]",
    "tokens": [
      "2",
      "1",
      "+",
      "3",
      "*"
    ],
    "expected": 9
  },
  {
    "id": 2,
    "name": "Division and addition",
    "input": "tokens = [\"4\", \"13\", \"5\", \"/\", \"+\"]",
    "tokens": [
      "4",
      "13",
      "5",
      "/",
      "+"
    ],
    "expected": 6
  },
  {
    "id": 3,
    "name": "Longer expression",
    "input": "tokens = [\"10\", \"6\", \"9\", \"3\", \"+\", \"-11\", \"*\", \"/\", \"*\", \"17\", \"+\", \"5\", \"+\"]",
    "tokens": [
      "10",
      "6",
      "9",
      "3",
      "+",
      "-11",
      "*",
      "/",
      "*",
      "17",
      "+",
      "5",
      "+"
    ],
    "expected": 22
  },
  {
    "id": 4,
    "name": "Negative result",
    "input": "tokens = [\"3\", \"-4\", \"+\"]",
    "tokens": [
      "3",
      "-4",
      "+"
    ],
    "expected": -1
  }
];

export const submitTests = [
  ...runTests
];
