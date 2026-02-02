class SmallestStringWithSwaps {
  smallestStringWithSwaps(s, pairs) {
    const n = s.length;
    const parent = Array.from({ length: n }, (_, i) => i);
    const rank = new Array(n).fill(0);

    const find = (x) => {
      if (parent[x] !== x) {
        parent[x] = find(parent[x]);
      }
      return parent[x];
    };

    const union = (a, b) => {
      const ra = find(a);
      const rb = find(b);
      if (ra === rb) {
        return;
      }
      if (rank[ra] < rank[rb]) {
        parent[ra] = rb;
      } else if (rank[ra] > rank[rb]) {
        parent[rb] = ra;
      } else {
        parent[rb] = ra;
        rank[ra] += 1;
      }
    };

    for (const [a, b] of pairs) {
      union(a, b);
    }

    const groups = new Map();
    for (let i = 0; i < n; i++) {
      const root = find(i);
      if (!groups.has(root)) {
        groups.set(root, []);
      }
      groups.get(root).push(i);
    }

    const res = s.split('');
    for (const indices of groups.values()) {
      const chars = indices.map((idx) => res[idx]).sort();
      indices.sort((a, b) => a - b);
      for (let i = 0; i < indices.length; i++) {
        res[indices[i]] = chars[i];
      }
    }

    return res.join('');
  }
}
