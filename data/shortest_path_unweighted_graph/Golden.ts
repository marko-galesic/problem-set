class ShortestPathUnweightedGraph {
  shortestPath(n, edges, start, end) {
    if (n <= 0) return -1;
    if (start === end) return 0;
    const adj = Array.from({ length: n }, () => []);
    if (Array.isArray(edges)) {
      for (const e of edges) {
        if (!Array.isArray(e) || e.length < 2) continue;
        const [u, v] = e;
        if (u < 0 || v < 0 || u >= n || v >= n) continue;
        adj[u].push(v);
        adj[v].push(u);
      }
    }
    const dist = Array(n).fill(-1);
    const queue = [start];
    let head = 0;
    dist[start] = 0;
    while (head < queue.length) {
      const u = queue[head++];
      if (u === end) return dist[u];
      for (const v of adj[u]) {
        if (dist[v] === -1) {
          dist[v] = dist[u] + 1;
          queue.push(v);
        }
      }
    }
    return -1;
  }
}
