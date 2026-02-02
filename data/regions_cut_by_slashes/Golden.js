class RegionsCutBySlashes {
  regionsBySlashes(grid) {
    const n = grid.length;
    const total = n * n * 4;
    const parent = Array.from({ length: total }, (_, i) => i);

    const find = (x) => {
      if (parent[x] !== x) {
        parent[x] = find(parent[x]);
      }
      return parent[x];
    };

    const union = (a, b) => {
      const ra = find(a);
      const rb = find(b);
      if (ra !== rb) {
        parent[rb] = ra;
      }
    };

    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const base = (r * n + c) * 4;
        const ch = grid[r][c];
        if (ch === ' ') {
          union(base, base + 1);
          union(base + 1, base + 2);
          union(base + 2, base + 3);
        } else if (ch === '/') {
          union(base, base + 3);
          union(base + 1, base + 2);
        } else if (ch === '\\') {
          union(base, base + 1);
          union(base + 2, base + 3);
        }

        if (r > 0) {
          const topBase = ((r - 1) * n + c) * 4;
          union(base, topBase + 2);
        }
        if (c > 0) {
          const leftBase = (r * n + (c - 1)) * 4;
          union(base + 3, leftBase + 1);
        }
      }
    }

    const roots = new Set();
    for (let i = 0; i < total; i++) {
      roots.add(find(i));
    }
    return roots.size;
  }
}
