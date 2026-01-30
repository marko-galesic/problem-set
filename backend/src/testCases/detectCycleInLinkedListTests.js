// Detect Cycle in Linked List test suite
//
// Test cases for detectCycleInLinkedList(ListNode head)

export const runTests = [
  {
    "id": 1,
    "name": "Cycle at index 1",
    "input": "head = [3,2,0,-4], pos = 1",
    "head": [
      3,
      2,
      0,
      -4
    ],
    "pos": 1,
    "expected": true
  },
  {
    "id": 2,
    "name": "Cycle at index 0",
    "input": "head = [1,2], pos = 0",
    "head": [
      1,
      2
    ],
    "pos": 0,
    "expected": true
  },
  {
    "id": 3,
    "name": "No cycle",
    "input": "head = [1], pos = -1",
    "head": [
      1
    ],
    "pos": -1,
    "expected": false
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "Empty list",
      "input": "head = null, pos = -1",
      "head": null,
      "pos": -1,
      "expected": false
    },
    {
      "id": 5,
      "name": "Cycle at index 2",
      "input": "head = [1,2,3,4,5], pos = 2",
      "head": [
        1,
        2,
        3,
        4,
        5
      ],
      "pos": 2,
      "expected": true
    }
];
