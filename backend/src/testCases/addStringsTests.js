// Add Strings test suite
//
// Test cases for addStrings method

export const runTests = [
  {
    "id": 1,
    "name": "Small numbers",
    "input": "num1 = \"11\", num2 = \"123\"",
    "num1": "11",
    "num2": "123",
    "expected": "134"
  },
  {
    "id": 2,
    "name": "Different lengths",
    "input": "num1 = \"456\", num2 = \"77\"",
    "num1": "456",
    "num2": "77",
    "expected": "533"
  },
  {
    "id": 3,
    "name": "Zeros",
    "input": "num1 = \"0\", num2 = \"0\"",
    "num1": "0",
    "num2": "0",
    "expected": "0"
  }
];

export const submitTests = [
  {
    "id": 4,
    "name": "Carry chain",
    "input": "num1 = \"999\", num2 = \"1\"",
    "num1": "999",
    "num2": "1",
    "expected": "1000"
  },
  {
    "id": 5,
    "name": "Same size",
    "input": "num1 = \"500\", num2 = \"500\"",
    "num1": "500",
    "num2": "500",
    "expected": "1000"
  },
  {
    "id": 6,
    "name": "Large numbers",
    "input": "num1 = \"123456789\", num2 = \"987654321\"",
    "num1": "123456789",
    "num2": "987654321",
    "expected": "1111111110"
  }
];
