class RedundantConnection {
  findRedundantConnection(edges) {
    let maxNode = 0;
    for (const [u, v] of edges) {
      maxNode = Math.max(maxNode, u, v);
    }
    const parent = Array.from({ length: maxNode + 1 }, (_, i) => i);
    const rank = new Array(maxNode + 1).fill(0);

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
        return false;
      }
      if (rank[ra] < rank[rb]) {
        parent[ra] = rb;
      } else if (rank[ra] > rank[rb]) {
        parent[rb] = ra;
      } else {
        parent[rb] = ra;
        rank[ra] += 1;
      }
      return true;
    };

    let answer = [];
    for (const [u, v] of edges) {
      if (!union(u, v)) {
        answer = [u, v];
      }
    }
    return answer;
  }
}
