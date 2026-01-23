// Paginated Article Stats test suite
//
// Test cases for analyzeArticles(Page[] pages, String author, String title)
// Returns a map with keys: sumByAuthor, countTitleMatches

const case1Pages = [
  {
    page: 1,
    total_pages: 2,
    data: [
      { id: 1, title: "Intro to HTTP", author: "alice", num_comments: 5 },
      { id: 2, title: "Pagination Tips", author: "bob", num_comments: 3 },
      { id: 3, title: "Intro to HTTP", author: "alice", num_comments: 2 }
    ]
  },
  {
    page: 2,
    total_pages: 2,
    data: [
      { id: 4, title: "Scaling APIs", author: "alice", num_comments: 7 },
      { id: 5, title: "Intro to HTTP", author: "carol", num_comments: 4 }
    ]
  }
];

const case2Pages = [
  {
    page: 1,
    total_pages: 1,
    data: [
      { id: 6, title: "Intro to HTTP", author: "alice", num_comments: 1 },
      { id: 7, title: "Other", author: "bob", num_comments: 2 }
    ]
  }
];

const case3Pages = [
  {
    page: 1,
    total_pages: 2,
    data: [
      { id: 10, title: "Deep Dive", author: "dana", num_comments: 1 },
      { id: 11, title: "Deep Dive", author: "erin", num_comments: 4 },
      { id: 12, title: "Other", author: "dana", num_comments: 5 }
    ]
  },
  {
    page: 2,
    total_pages: 2,
    data: [
      { id: 13, title: "Deep Dive", author: "dana", num_comments: 9 }
    ]
  }
];

const case4Pages = [
  {
    page: 1,
    total_pages: 1,
    data: [
      { id: 20, title: "hello", author: "Alice", num_comments: 2 },
      { id: 21, title: "Hello", author: "Alice", num_comments: 5 },
      { id: 22, title: "hello", author: "alice", num_comments: 7 }
    ]
  }
];

const case5Pages = [
  {
    page: 1,
    total_pages: 2,
    data: []
  },
  {
    page: 2,
    total_pages: 2,
    data: [
      { id: 30, title: "Zero", author: "bob", num_comments: 0 },
      { id: 31, title: "Zero", author: "bob", num_comments: 2 }
    ]
  }
];

const case6Pages = [
  {
    page: 1,
    total_pages: 2,
    data: [
      { id: 40, title: "Shared Title", author: "tom", num_comments: 1 },
      { id: 41, title: "Shared Title", author: "lea", num_comments: 3 }
    ]
  },
  {
    page: 2,
    total_pages: 2,
    data: [
      { id: 42, title: "Other", author: "maria", num_comments: 8 }
    ]
  }
];

export const runTests = [
  {
    id: 1,
    name: "Two pages, mixed authors",
    input: 'author = "alice", title = "Intro to HTTP"',
    apiPages: case1Pages,
    author: "alice",
    title: "Intro to HTTP",
    expected: { sumByAuthor: 14, countTitleMatches: 3 }
  },
  {
    id: 2,
    name: "No matches",
    input: 'author = "zoe", title = "Missing"',
    apiPages: case2Pages,
    author: "zoe",
    title: "Missing",
    expected: { sumByAuthor: 0, countTitleMatches: 0 }
  },
  {
    id: 3,
    name: "Multiple matches across pages",
    input: 'author = "dana", title = "Deep Dive"',
    apiPages: case3Pages,
    author: "dana",
    title: "Deep Dive",
    expected: { sumByAuthor: 15, countTitleMatches: 3 }
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Case-sensitive matching",
    input: 'author = "Alice", title = "hello"',
    apiPages: case4Pages,
    author: "Alice",
    title: "hello",
    expected: { sumByAuthor: 7, countTitleMatches: 2 }
  },
  {
    id: 5,
    name: "Empty data page",
    input: 'author = "bob", title = "Zero"',
    apiPages: case5Pages,
    author: "bob",
    title: "Zero",
    expected: { sumByAuthor: 2, countTitleMatches: 2 }
  },
  {
    id: 6,
    name: "Title matches without author matches",
    input: 'author = "maria", title = "Shared Title"',
    apiPages: case6Pages,
    author: "maria",
    title: "Shared Title",
    expected: { sumByAuthor: 8, countTitleMatches: 2 }
  }
];
