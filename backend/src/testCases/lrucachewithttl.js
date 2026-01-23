// lruCache_tests.js
//
// LeetCode-style tests for an LRUCache (optionally with TTL).
//
// Harness contract (suggested):
// - You will IGNORE `input` and use { capacity, ttlMillis?, steps }.
// - steps are executed in order.
// - Each step can optionally include `at` (millis) to control time.
//   - If your solution uses System.currentTimeMillis() (Java), your harness can
//     simulate time by injecting a clock OR by running with a tiny wrapper.
//   - If you *don’t* support time control yet, you can ignore `at` and still
//     run all non-TTL tests (most of runTests + many of submitTests).
//
// Step format:
//   { op: "put", args: [key, value], at?: number }
//   { op: "get", args: [key], at?: number, expected: number }
//
// Notes about TTL semantics (aligned with the “golden solution” you pasted):
// - TTL refreshes on put (refresh-on-write).
// - get() does NOT refresh TTL (unless you change it).
// - Expired entries return -1 and are removed lazily.
// - Eviction is LRU among currently stored entries.
//
// If your constructor signature is (capacity) only, ignore ttlMillis in tests.
// If your constructor signature is (capacity, ttlMillis), use ttlMillis.

export const runTests = [
  // ---------------- Basic LRU behavior (no TTL needed) ----------------
  {
    id: 1,
    name: "Basic put/get",
    input: "capacity=2; put(1,1); get(1)=1",
    capacity: 2,
    steps: [
      { op: "put", args: [1, 1] },
      { op: "get", args: [1], expected: 1 }
    ]
  },
  {
    id: 2,
    name: "Missing key returns -1",
    input: "capacity=2; get(42)=-1",
    capacity: 2,
    steps: [{ op: "get", args: [42], expected: -1 }]
  },
  {
    id: 3,
    name: "Evicts LRU on overflow",
    input: "capacity=2; put(1,1); put(2,2); put(3,3) => evict 1",
    capacity: 2,
    steps: [
      { op: "put", args: [1, 1] },
      { op: "put", args: [2, 2] },
      { op: "put", args: [3, 3] },
      { op: "get", args: [1], expected: -1 },
      { op: "get", args: [2], expected: 2 },
      { op: "get", args: [3], expected: 3 }
    ]
  },
  {
    id: 4,
    name: "Get promotes to MRU",
    input: "capacity=2; put(1,1); put(2,2); get(1); put(3,3) => evict 2",
    capacity: 2,
    steps: [
      { op: "put", args: [1, 1] },
      { op: "put", args: [2, 2] },
      { op: "get", args: [1], expected: 1 }, // 1 becomes MRU; 2 becomes LRU
      { op: "put", args: [3, 3] }, // evict 2
      { op: "get", args: [2], expected: -1 },
      { op: "get", args: [1], expected: 1 },
      { op: "get", args: [3], expected: 3 }
    ]
  },
  {
    id: 5,
    name: "Update existing key should not increase size; becomes MRU",
    input: "capacity=2; put(1,1); put(2,2); put(1,10); put(3,3) => evict 2",
    capacity: 2,
    steps: [
      { op: "put", args: [1, 1] },
      { op: "put", args: [2, 2] },
      { op: "put", args: [1, 10] }, // update + move to MRU
      { op: "put", args: [3, 3] }, // evict LRU => 2
      { op: "get", args: [2], expected: -1 },
      { op: "get", args: [1], expected: 10 },
      { op: "get", args: [3], expected: 3 }
    ]
  },
  {
    id: 6,
    name: "Capacity=1 always keeps most recent key",
    input: "capacity=1; put(1,1); put(2,2) => evict 1",
    capacity: 1,
    steps: [
      { op: "put", args: [1, 1] },
      { op: "put", args: [2, 2] },
      { op: "get", args: [1], expected: -1 },
      { op: "get", args: [2], expected: 2 }
    ]
  },
  {
    id: 7,
    name: "Repeated gets do not change returned values; order stable",
    input: "capacity=2; put(1,1); put(2,2); get(1); get(1); put(3,3) => evict 2",
    capacity: 2,
    steps: [
      { op: "put", args: [1, 1] },
      { op: "put", args: [2, 2] },
      { op: "get", args: [1], expected: 1 },
      { op: "get", args: [1], expected: 1 },
      { op: "put", args: [3, 3] },
      { op: "get", args: [2], expected: -1 },
      { op: "get", args: [1], expected: 1 },
      { op: "get", args: [3], expected: 3 }
    ]
  },
  {
    id: 8,
    name: "Negative keys and values supported",
    input: "capacity=2; put(-1,-10); get(-1)=-10",
    capacity: 2,
    steps: [
      { op: "put", args: [-1, -10] },
      { op: "get", args: [-1], expected: -10 }
    ]
  }
];

export const submitTests = [
  ...runTests,

  // ---------------- More edge / stress cases ----------------
  {
    id: 101,
    name: "Capacity=0 is a no-op cache",
    input: "capacity=0; put(1,1); get(1)=-1",
    capacity: 0,
    steps: [
      { op: "put", args: [1, 1] },
      { op: "get", args: [1], expected: -1 }
    ]
  },
  {
    id: 102,
    name: "Longer eviction chain (classic LeetCode example)",
    input:
      "capacity=2; put(1,1); put(2,2); get(1)=1; put(3,3); get(2)=-1; put(4,4); get(1)=-1; get(3)=3; get(4)=4",
    capacity: 2,
    steps: [
      { op: "put", args: [1, 1] },
      { op: "put", args: [2, 2] },
      { op: "get", args: [1], expected: 1 },
      { op: "put", args: [3, 3] }, // evict 2
      { op: "get", args: [2], expected: -1 },
      { op: "put", args: [4, 4] }, // evict 1
      { op: "get", args: [1], expected: -1 },
      { op: "get", args: [3], expected: 3 },
      { op: "get", args: [4], expected: 4 }
    ]
  },
  {
    id: 103,
    name: "Update does not accidentally evict",
    input: "capacity=2; put(1,1); put(2,2); put(2,20); get(2)=20; get(1)=1",
    capacity: 2,
    steps: [
      { op: "put", args: [1, 1] },
      { op: "put", args: [2, 2] },
      { op: "put", args: [2, 20] },
      { op: "get", args: [2], expected: 20 },
      { op: "get", args: [1], expected: 1 }
    ]
  },
  {
    id: 104,
    name: "Capacity=0: Multiple sequential puts are all no-ops",
    input: "capacity=0; put(1,1); put(2,2); put(3,3); all should fail to store",
    capacity: 0,
    steps: [
      { op: "put", args: [1, 1] },
      { op: "put", args: [2, 2] },
      { op: "put", args: [3, 3] },
      { op: "get", args: [1], expected: -1 },
      { op: "get", args: [2], expected: -1 },
      { op: "get", args: [3], expected: -1 }
    ]
  },
  {
    id: 105,
    name: "Capacity=0: Multiple gets after puts all return -1",
    input: "capacity=0; put(1,1); put(2,2); put(3,3); get(1)=-1; get(2)=-1; get(3)=-1",
    capacity: 0,
    steps: [
      { op: "put", args: [1, 1] },
      { op: "put", args: [2, 2] },
      { op: "put", args: [3, 3] },
      { op: "get", args: [1], expected: -1 },
      { op: "get", args: [2], expected: -1 },
      { op: "get", args: [3], expected: -1 }
    ]
  },
  {
    id: 106,
    name: "Capacity=0: Update same key multiple times is still no-op",
    input: "capacity=0; put(1,1); put(1,10); put(1,100); get(1)=-1",
    capacity: 0,
    steps: [
      { op: "put", args: [1, 1] },
      { op: "put", args: [1, 10] },
      { op: "put", args: [1, 100] },
      { op: "get", args: [1], expected: -1 }
    ]
  },
  {
    id: 107,
    name: "Capacity=0: Negative keys/values are not stored",
    input: "capacity=0; put(-1,-10); put(-2,-20); get(-1)=-1; get(-2)=-1",
    capacity: 0,
    steps: [
      { op: "put", args: [-1, -10] },
      { op: "put", args: [-2, -20] },
      { op: "get", args: [-1], expected: -1 },
      { op: "get", args: [-2], expected: -1 }
    ]
  },
  {
    id: 108,
    name: "Capacity=0: Mixed operations (alternating puts/gets) are all no-ops",
    input: "capacity=0; put(1,1); get(1)=-1; put(2,2); get(2)=-1; put(3,3); get(3)=-1",
    capacity: 0,
    steps: [
      { op: "put", args: [1, 1] },
      { op: "get", args: [1], expected: -1 },
      { op: "put", args: [2, 2] },
      { op: "get", args: [2], expected: -1 },
      { op: "put", args: [3, 3] },
      { op: "get", args: [3], expected: -1 }
    ]
  },

  // ---------------- TTL cases (requires harness time control OR adjustable TTL) ----------------
  //
  // These assume you support a constructor (capacity, ttlMillis).
  // If your current solution hardcodes TTL (like the golden solution),
  // you can still run these by temporarily setting ttlMillis small in the code.
  //
  {
    id: 201,
    name: "TTL: entry expires and returns -1",
    input: "ttl=50ms; put(1,1) at t=0; get(1) at t=49 => 1; get(1) at t=100 => -1",
    capacity: 2,
    ttlMillis: 50,
    steps: [
      { op: "put", args: [1, 1], at: 0 },
      { op: "get", args: [1], at: 49, expected: 1 },
      { op: "get", args: [1], at: 100, expected: -1 }
    ]
  },
  {
    id: 202,
    name: "TTL: refresh-on-write extends expiry",
    input: "ttl=50ms; put(1,1) at t=0; put(1,9) at t=40; get(1) at t=80 => 9; get(1) at t=90 => -1",
    capacity: 2,
    ttlMillis: 50,
    steps: [
      { op: "put", args: [1, 1], at: 0 },
      { op: "put", args: [1, 9], at: 40 }, // refresh expiry to 90
      { op: "get", args: [1], at: 80, expected: 9 },
      { op: "get", args: [1], at: 90, expected: -1 }
    ]
  },
  {
    id: 203,
    name: "TTL: expired entries removed lazily on get",
    input: "ttl=30ms; put(1,1) at t=0; get(1) at t=31 => -1; then put(2,2) and get(2)=2",
    capacity: 2,
    ttlMillis: 30,
    steps: [
      { op: "put", args: [1, 1], at: 0 },
      { op: "get", args: [1], at: 31, expected: -1 },
      { op: "put", args: [2, 2], at: 31 },
      { op: "get", args: [2], at: 31, expected: 2 }
    ]
  },
  {
    id: 204,
    name: "TTL + eviction: should evict LRU among non-expired; expired should not force eviction of live",
    input:
      "cap=2 ttl=50ms; put(1,1) t=0; put(2,2) t=0; (1 expires at 50,2 at 50). At t=60 both expired; put(3,3) should not evict live (none live). get(3)=3",
    capacity: 2,
    ttlMillis: 50,
    steps: [
      { op: "put", args: [1, 1], at: 0 },
      { op: "put", args: [2, 2], at: 0 },
      { op: "put", args: [3, 3], at: 60 },
      { op: "get", args: [1], at: 60, expected: -1 },
      { op: "get", args: [2], at: 60, expected: -1 },
      { op: "get", args: [3], at: 60, expected: 3 }
    ]
  },
  {
    id: 205,
    name: "Capacity=0 with TTL: TTL does not interfere with zero capacity behavior",
    input: "capacity=0 ttl=50ms; put(1,1) at t=0; get(1) at t=10 => -1; put(2,2) at t=20; get(2) at t=30 => -1",
    capacity: 0,
    ttlMillis: 50,
    steps: [
      { op: "put", args: [1, 1], at: 0 },
      { op: "get", args: [1], at: 10, expected: -1 },
      { op: "put", args: [2, 2], at: 20 },
      { op: "get", args: [2], at: 30, expected: -1 }
    ]
  },
];