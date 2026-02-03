// Auto-generated test suite

export const runTests = [
  {
    "id": 1,
    "name": "Valid IPv4",
    "input": "queryIP = \"172.16.254.1\"",
    "queryIP": "172.16.254.1",
    "expected": "IPv4"
  },
  {
    "id": 2,
    "name": "Valid IPv6",
    "input": "queryIP = \"2001:0db8:85a3:0000:0000:8a2e:0370:7334\"",
    "queryIP": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
    "expected": "IPv6"
  },
  {
    "id": 3,
    "name": "Out of range",
    "input": "queryIP = \"256.256.256.256\"",
    "queryIP": "256.256.256.256",
    "expected": "Neither"
  }
];

export const submitTests = [
  {
    "id": 1,
    "name": "Valid IPv4",
    "input": "queryIP = \"172.16.254.1\"",
    "queryIP": "172.16.254.1",
    "expected": "IPv4"
  },
  {
    "id": 2,
    "name": "Valid IPv6",
    "input": "queryIP = \"2001:0db8:85a3:0000:0000:8a2e:0370:7334\"",
    "queryIP": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
    "expected": "IPv6"
  },
  {
    "id": 3,
    "name": "Out of range",
    "input": "queryIP = \"256.256.256.256\"",
    "queryIP": "256.256.256.256",
    "expected": "Neither"
  },
  {
    "id": 4,
    "name": "Invalid characters",
    "input": "queryIP = \"1e1.4.5.6\"",
    "queryIP": "1e1.4.5.6",
    "expected": "Neither"
  },
  {
    "id": 5,
    "name": "Leading zeros",
    "input": "queryIP = \"192.168.1.01\"",
    "queryIP": "192.168.1.01",
    "expected": "Neither"
  },
  {
    "id": 6,
    "name": "Invalid IPv6 format",
    "input": "queryIP = \"2001:db8:85a3::8A2E:0370:7334\"",
    "queryIP": "2001:db8:85a3::8A2E:0370:7334",
    "expected": "Neither"
  }
];
