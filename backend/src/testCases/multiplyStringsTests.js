// Multiply Strings test suite
//
// Test cases for multiplyStrings method

export const runTests = [
  {
    "id": 1,
    "name": "Small product",
    "input": "num1 = \"2\", num2 = \"3\"",
    "num1": "2",
    "num2": "3",
    "expected": "6"
  },
  {
    "id": 2,
    "name": "Medium product",
    "input": "num1 = \"123\", num2 = \"456\"",
    "num1": "123",
    "num2": "456",
    "expected": "56088"
  },
  {
    "id": 3,
    "name": "Zero",
    "input": "num1 = \"0\", num2 = \"52\"",
    "num1": "0",
    "num2": "52",
    "expected": "0"
  }
];

export const submitTests = [
  {
    "id": 4,
    "name": "Single digits",
    "input": "num1 = \"9\", num2 = \"9\"",
    "num1": "9",
    "num2": "9",
    "expected": "81"
  },
  {
    "id": 5,
    "name": "Two digits",
    "input": "num1 = \"99\", num2 = \"99\"",
    "num1": "99",
    "num2": "99",
    "expected": "9801"
  },
  {
    "id": 6,
    "name": "Trailing zeros",
    "input": "num1 = \"25\", num2 = \"4\"",
    "num1": "25",
    "num2": "4",
    "expected": "100"
  },
  {
    "id": 7,
    "name": "All zeros",
    "input": "num1 = \"1000\", num2 = \"0\"",
    "num1": "1000",
    "num2": "0",
    "expected": "0"
  }
];
