// Roman To Integer test suite
//
// Test cases for romanToInt method

export const runTests = [
  {
    "id": 1,
    "name": "Simple",
    "input": "s = \"III\"",
    "s": "III",
    "expected": 3
  },
  {
    "id": 2,
    "name": "Subtractive",
    "input": "s = \"IV\"",
    "s": "IV",
    "expected": 4
  },
  {
    "id": 3,
    "name": "Complex",
    "input": "s = \"MCMXCIV\"",
    "s": "MCMXCIV",
    "expected": 1994
  }
];

export const submitTests = [
  {
    "id": 4,
    "name": "Mixed",
    "input": "s = \"LVIII\"",
    "s": "LVIII",
    "expected": 58
  },
  {
    "id": 5,
    "name": "Nine",
    "input": "s = \"IX\"",
    "s": "IX",
    "expected": 9
  },
  {
    "id": 6,
    "name": "Forty",
    "input": "s = \"XL\"",
    "s": "XL",
    "expected": 40
  },
  {
    "id": 7,
    "name": "Year",
    "input": "s = \"MMXXV\"",
    "s": "MMXXV",
    "expected": 2025
  }
];
