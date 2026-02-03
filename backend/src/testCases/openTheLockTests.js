export const runTests = [
  {
    id: 1,
    name: "Leetcode example",
    input: "deadends = [\"0201\",\"0101\",\"0102\",\"1212\",\"2002\"], target = \"0202\"",
    deadends: ["0201", "0101", "0102", "1212", "2002"],
    target: "0202",
    expected: 6
  },
  {
    id: 2,
    name: "Single move",
    input: "deadends = [\"8888\"], target = \"0009\"",
    deadends: ["8888"],
    target: "0009",
    expected: 1
  },
  {
    id: 3,
    name: "Already at target",
    input: "deadends = [], target = \"0000\"",
    deadends: [],
    target: "0000",
    expected: 0
  }
];

export const submitTests = [
  {
    id: 1,
    name: "Leetcode example",
    input: "deadends = [\"0201\",\"0101\",\"0102\",\"1212\",\"2002\"], target = \"0202\"",
    deadends: ["0201", "0101", "0102", "1212", "2002"],
    target: "0202",
    expected: 6
  },
  {
    id: 2,
    name: "Single move",
    input: "deadends = [\"8888\"], target = \"0009\"",
    deadends: ["8888"],
    target: "0009",
    expected: 1
  },
  {
    id: 3,
    name: "Already at target",
    input: "deadends = [], target = \"0000\"",
    deadends: [],
    target: "0000",
    expected: 0
  },
  {
    id: 4,
    name: "Start is deadend",
    input: "deadends = [\"0000\"], target = \"8888\"",
    deadends: ["0000"],
    target: "8888",
    expected: -1
  }
];
