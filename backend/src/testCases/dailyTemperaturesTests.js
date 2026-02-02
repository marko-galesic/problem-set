// Daily Temperatures test suite
//
// Test cases for dailyTemperatures(int[] temperatures) method
// Returns int[]

export const runTests = [
  {
    id: 1,
    name: "Classic example",
    input: 'temperatures = [73,74,75,71,69,72,76,73]',
    temperatures: [73, 74, 75, 71, 69, 72, 76, 73],
    expected: [1, 1, 4, 2, 1, 1, 0, 0]
  },
  {
    id: 2,
    name: "Strictly decreasing",
    input: 'temperatures = [80,79,78]',
    temperatures: [80, 79, 78],
    expected: [0, 0, 0]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "Single day",
    input: 'temperatures = [70]',
    temperatures: [70],
    expected: [0]
  },
  {
    id: 4,
    name: "Multiple rises",
    input: 'temperatures = [60,61,62,63]',
    temperatures: [60, 61, 62, 63],
    expected: [1, 1, 1, 0]
  }
];
