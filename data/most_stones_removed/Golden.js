class MostStonesRemoved {
  removeStones(stones) {
    const parent = [];
    const rank = [];

    const add = () => {
      const id = parent.length;
      parent.push(id);
      rank.push(0);
      return id;
    };

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

    const ids = new Map();
    const used = new Set();
    for (const [r, c] of stones) {
      const rowKey = `r${r}`;
      const colKey = `c${c}`;
      if (!ids.has(rowKey)) {
        ids.set(rowKey, add());
      }
      if (!ids.has(colKey)) {
        ids.set(colKey, add());
      }
      const rowId = ids.get(rowKey);
      const colId = ids.get(colKey);
      union(rowId, colId);
      used.add(rowId);
      used.add(colId);
    }

    const roots = new Set();
    for (const id of used) {
      roots.add(find(id));
    }
    return stones.length - roots.size;
  }
}
