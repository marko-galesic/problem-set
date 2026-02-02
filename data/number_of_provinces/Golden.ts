class NumberOfProvinces {
  findCircleNum(isConnected) {
    const n = isConnected.length;
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

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (isConnected[i][j] === 1) {
          union(i, j);
        }
      }
    }

    let count = 0;
    for (let i = 0; i < n; i++) {
      if (find(i) === i) {
        count += 1;
      }
    }
    return count;
  }
}
