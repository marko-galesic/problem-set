// Auto-generated test suite

export const runTests = [
  {
    "id": 1,
    "name": "Midnight wrap",
    "input": "timePoints = [\"23:59\", \"00:00\"]",
    "timePoints": [
      "23:59",
      "00:00"
    ],
    "expected": 1
  },
  {
    "id": 2,
    "name": "Duplicate times",
    "input": "timePoints = [\"00:00\", \"23:59\", \"00:00\"]",
    "timePoints": [
      "00:00",
      "23:59",
      "00:00"
    ],
    "expected": 0
  },
  {
    "id": 3,
    "name": "Simple gap",
    "input": "timePoints = [\"01:01\", \"02:01\", \"03:00\"]",
    "timePoints": [
      "01:01",
      "02:01",
      "03:00"
    ],
    "expected": 59
  }
];

export const submitTests = [
  {
    "id": 1,
    "name": "Midnight wrap",
    "input": "timePoints = [\"23:59\", \"00:00\"]",
    "timePoints": [
      "23:59",
      "00:00"
    ],
    "expected": 1
  },
  {
    "id": 2,
    "name": "Duplicate times",
    "input": "timePoints = [\"00:00\", \"23:59\", \"00:00\"]",
    "timePoints": [
      "00:00",
      "23:59",
      "00:00"
    ],
    "expected": 0
  },
  {
    "id": 3,
    "name": "Simple gap",
    "input": "timePoints = [\"01:01\", \"02:01\", \"03:00\"]",
    "timePoints": [
      "01:01",
      "02:01",
      "03:00"
    ],
    "expected": 59
  },
  {
    "id": 4,
    "name": "Small intervals",
    "input": "timePoints = [\"12:30\", \"12:35\", \"12:40\"]",
    "timePoints": [
      "12:30",
      "12:35",
      "12:40"
    ],
    "expected": 5
  },
  {
    "id": 5,
    "name": "Wrap difference",
    "input": "timePoints = [\"05:31\", \"22:08\", \"00:35\"]",
    "timePoints": [
      "05:31",
      "22:08",
      "00:35"
    ],
    "expected": 147
  },
  {
    "id": 6,
    "name": "Adjacent minutes",
    "input": "timePoints = [\"00:01\", \"00:02\"]",
    "timePoints": [
      "00:01",
      "00:02"
    ],
    "expected": 1
  }
];
