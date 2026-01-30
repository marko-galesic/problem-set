// Integer To Roman test suite
//
// Test cases for intToRoman method

export const runTests = [
  {
    "id": 1,
    "name": "Three",
    "input": "num = 3",
    "num": 3,
    "expected": "III"
  },
  {
    "id": 2,
    "name": "Four",
    "input": "num = 4",
    "num": 4,
    "expected": "IV"
  },
  {
    "id": 3,
    "name": "Complex",
    "input": "num = 1994",
    "num": 1994,
    "expected": "MCMXCIV"
  }
];

export const submitTests = [
  {
    "id": 4,
    "name": "Fifty eight",
    "input": "num = 58",
    "num": 58,
    "expected": "LVIII"
  },
  {
    "id": 5,
    "name": "Nine",
    "input": "num = 9",
    "num": 9,
    "expected": "IX"
  },
  {
    "id": 6,
    "name": "Forty",
    "input": "num = 40",
    "num": 40,
    "expected": "XL"
  },
  {
    "id": 7,
    "name": "Year",
    "input": "num = 2025",
    "num": 2025,
    "expected": "MMXXV"
  },
  {
    "id": 8,
    "name": "Max range",
    "input": "num = 3999",
    "num": 3999,
    "expected": "MMMCMXCIX"
  }
];
