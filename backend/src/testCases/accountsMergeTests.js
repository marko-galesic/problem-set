// Accounts Merge test suite
//
// Test cases for accountsMerge(String[] accounts) method
// Returns String[][] sorted by name then first email

export const runTests = [
  {
    id: 1,
    name: "Classic merge",
    input:
      'accounts = ["John,johnsmith@mail.com,john_newyork@mail.com","John,johnsmith@mail.com,john00@mail.com","Mary,mary@mail.com","John,johnnybravo@mail.com"]',
    accounts: [
      "John,johnsmith@mail.com,john_newyork@mail.com",
      "John,johnsmith@mail.com,john00@mail.com",
      "Mary,mary@mail.com",
      "John,johnnybravo@mail.com"
    ],
    expected: [
      ["John", "john00@mail.com", "john_newyork@mail.com", "johnsmith@mail.com"],
      ["John", "johnnybravo@mail.com"],
      ["Mary", "mary@mail.com"]
    ]
  },
  {
    id: 2,
    name: "No merges",
    input: 'accounts = ["A,a@mail.com","B,b@mail.com"]',
    accounts: ["A,a@mail.com", "B,b@mail.com"],
    expected: [
      ["A", "a@mail.com"],
      ["B", "b@mail.com"]
    ]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "Chain merge",
    input:
      'accounts = ["Alex,alex@mail.com,alex2@mail.com","Alex,alex2@mail.com,alex3@mail.com","Alex,alex4@mail.com"]',
    accounts: [
      "Alex,alex@mail.com,alex2@mail.com",
      "Alex,alex2@mail.com,alex3@mail.com",
      "Alex,alex4@mail.com"
    ],
    expected: [
      ["Alex", "alex2@mail.com", "alex3@mail.com", "alex@mail.com"],
      ["Alex", "alex4@mail.com"]
    ]
  },
  {
    id: 4,
    name: "Shared email across two accounts",
    input: 'accounts = ["Sam,sam@mail.com","Sam,sam@mail.com,sam2@mail.com"]',
    accounts: ["Sam,sam@mail.com", "Sam,sam@mail.com,sam2@mail.com"],
    expected: [["Sam", "sam2@mail.com", "sam@mail.com"]]
  }
];
