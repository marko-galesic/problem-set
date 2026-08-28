// YouTube Ads test suite
//
// Test cases for maxPayout method

export const runTests = [
  {
    id: 1,
    name: 'Greedy trap',
    input: 'ads = [[1,4,3],[3,7,7],[6,10,8],[9,10,5]]',
    ads: [[1, 4, 3], [3, 7, 7], [6, 10, 8], [9, 10, 5]],
    expected: 12
  },
  {
    id: 2,
    name: 'Touching endpoints',
    input: 'ads = [[0,2,4],[2,5,6]]',
    ads: [[0, 2, 4], [2, 5, 6]],
    expected: 10
  },
  {
    id: 3,
    name: 'Unsorted compatible chain',
    input: 'ads = [[5,7,5],[0,2,4],[2,5,6]]',
    ads: [[5, 7, 5], [0, 2, 4], [2, 5, 6]],
    expected: 15
  }
];

export const submitTests = [
  {
    id: 4,
    name: 'Empty input',
    input: 'ads = []',
    ads: [],
    expected: 0
  },
  {
    id: 5,
    name: 'One ad',
    input: 'ads = [[4,9,11]]',
    ads: [[4, 9, 11]],
    expected: 11
  },
  {
    id: 6,
    name: 'All overlapping',
    input: 'ads = [[0,10,8],[1,9,12],[2,8,9]]',
    ads: [[0, 10, 8], [1, 9, 12], [2, 8, 9]],
    expected: 12
  },
  {
    id: 7,
    name: 'Duplicate intervals',
    input: 'ads = [[1,3,5],[1,3,7],[3,5,4]]',
    ads: [[1, 3, 5], [1, 3, 7], [3, 5, 4]],
    expected: 11
  },
  {
    id: 8,
    name: 'Chain beats one long ad',
    input: 'ads = [[0,10,20],[0,2,6],[2,4,6],[4,6,6],[6,8,6]]',
    ads: [[0, 10, 20], [0, 2, 6], [2, 4, 6], [4, 6, 6], [6, 8, 6]],
    expected: 24
  }
];

