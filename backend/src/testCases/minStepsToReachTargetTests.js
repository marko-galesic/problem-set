export const runTests = [
  {
    id: 1,
    name: "Basic reach",
    input: "start = 2, target = 7",
    start: 2,
    target: 7,
    expected: 3
  },
  {
    id: 2,
    name: "Already there",
    input: "start = 0, target = 0",
    start: 0,
    target: 0,
    expected: 0
  },
  {
    id: 3,
    name: "Move backward",
    input: "start = 5, target = 3",
    start: 5,
    target: 3,
    expected: 2
  }
];

export const submitTests = [
  {
    id: 1,
    name: "Basic reach",
    input: "start = 2, target = 7",
    start: 2,
    target: 7,
    expected: 3
  },
  {
    id: 2,
    name: "Already there",
    input: "start = 0, target = 0",
    start: 0,
    target: 0,
    expected: 0
  },
  {
    id: 3,
    name: "Move backward",
    input: "start = 5, target = 3",
    start: 5,
    target: 3,
    expected: 2
  },
  {
    id: 4,
    name: "Larger target",
    input: "start = 1, target = 10",
    start: 1,
    target: 10,
    expected: 4
  }
];
