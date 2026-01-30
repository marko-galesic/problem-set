// Palindrome Number test suite
//
// Test cases for isPalindrome method

export const runTests = [
  {
    "id": 1,
    "name": "Palindrome",
    "input": "x = 121",
    "x": 121,
    "expected": true
  },
  {
    "id": 2,
    "name": "Negative",
    "input": "x = -121",
    "x": -121,
    "expected": false
  },
  {
    "id": 3,
    "name": "Ends with zero",
    "input": "x = 10",
    "x": 10,
    "expected": false
  }
];

export const submitTests = [
  {
    "id": 4,
    "name": "Zero",
    "input": "x = 0",
    "x": 0,
    "expected": true
  },
  {
    "id": 5,
    "name": "Odd length",
    "input": "x = 12321",
    "x": 12321,
    "expected": true
  },
  {
    "id": 6,
    "name": "Not palindrome",
    "input": "x = 123",
    "x": 123,
    "expected": false
  }
];
