// Palindrome Linked List test suite
//
// Test cases for isPalindrome(ListNode head) method
// Returns boolean: true if the list is a palindrome
// Test cases use array representation: [1,2,3] represents 1->2->3

export const runTests = [
  {
    id: 1,
    name: "Even length palindrome",
    input: "head = [1, 2, 2, 1]",
    head: [1, 2, 2, 1],
    expected: true
  },
  {
    id: 2,
    name: "Odd length palindrome",
    input: "head = [1, 2, 3, 2, 1]",
    head: [1, 2, 3, 2, 1],
    expected: true
  },
  {
    id: 3,
    name: "Not a palindrome",
    input: "head = [1, 2]",
    head: [1, 2],
    expected: false
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 5,
    name: "Single node",
    input: "head = [7]",
    head: [7],
    expected: true
  },
  {
    id: 6,
    name: "Two nodes same",
    input: "head = [4, 4]",
    head: [4, 4],
    expected: true
  },
  {
    id: 7,
    name: "Even length non-palindrome",
    input: "head = [1, 2, 3, 4]",
    head: [1, 2, 3, 4],
    expected: false
  },
  {
    id: 8,
    name: "Odd length non-palindrome",
    input: "head = [1, 2, 3, 4, 1]",
    head: [1, 2, 3, 4, 1],
    expected: false
  },
  {
    id: 9,
    name: "Negative values palindrome",
    input: "head = [-1, 2, -1]",
    head: [-1, 2, -1],
    expected: true
  },
  {
    id: 10,
    name: "Mixed values non-palindrome",
    input: "head = [1, -2, 2, 1]",
    head: [1, -2, 2, 1],
    expected: false
  },
  {
    id: 11,
    name: "All zeros",
    input: "head = [0, 0, 0, 0]",
    head: [0, 0, 0, 0],
    expected: true
  },
  {
    id: 12,
    name: "Longer palindrome",
    input: "head = [1, 2, 3, 4, 3, 2, 1]",
    head: [1, 2, 3, 4, 3, 2, 1],
    expected: true
  }
];
