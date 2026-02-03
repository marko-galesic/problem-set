export const runTests = [
  {
    id: 1,
    name: "Single mutation",
    input: "start = \"AACCGGTT\", end = \"AACCGGTA\", bank = [\"AACCGGTA\"]",
    start: "AACCGGTT",
    end: "AACCGGTA",
    bank: ["AACCGGTA"],
    expected: 1
  },
  {
    id: 2,
    name: "Two mutations",
    input: "start = \"AACCGGTT\", end = \"AAACGGTA\", bank = [\"AACCGGTA\",\"AACCGCTA\",\"AAACGGTA\"]",
    start: "AACCGGTT",
    end: "AAACGGTA",
    bank: ["AACCGGTA", "AACCGCTA", "AAACGGTA"],
    expected: 2
  },
  {
    id: 3,
    name: "No path",
    input: "start = \"AAAAACCC\", end = \"AACCCCCC\", bank = [\"AAAACCCC\",\"AAACCCCC\"]",
    start: "AAAAACCC",
    end: "AACCCCCC",
    bank: ["AAAACCCC", "AAACCCCC"],
    expected: -1
  }
];

export const submitTests = [
  {
    id: 1,
    name: "Single mutation",
    input: "start = \"AACCGGTT\", end = \"AACCGGTA\", bank = [\"AACCGGTA\"]",
    start: "AACCGGTT",
    end: "AACCGGTA",
    bank: ["AACCGGTA"],
    expected: 1
  },
  {
    id: 2,
    name: "Two mutations",
    input: "start = \"AACCGGTT\", end = \"AAACGGTA\", bank = [\"AACCGGTA\",\"AACCGCTA\",\"AAACGGTA\"]",
    start: "AACCGGTT",
    end: "AAACGGTA",
    bank: ["AACCGGTA", "AACCGCTA", "AAACGGTA"],
    expected: 2
  },
  {
    id: 3,
    name: "No path",
    input: "start = \"AAAAACCC\", end = \"AACCCCCC\", bank = [\"AAAACCCC\",\"AAACCCCC\"]",
    start: "AAAAACCC",
    end: "AACCCCCC",
    bank: ["AAAACCCC", "AAACCCCC"],
    expected: -1
  },
  {
    id: 4,
    name: "Start equals end",
    input: "start = \"AACCGGTT\", end = \"AACCGGTT\", bank = [\"AACCGGTA\"]",
    start: "AACCGGTT",
    end: "AACCGGTT",
    bank: ["AACCGGTA"],
    expected: 0
  }
];
