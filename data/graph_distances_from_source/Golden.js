class GraphDistancesFromSource {
  distancesFromSource(n, edges, source) {
    if (n <= 0) return [];
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
    if (source < 0 || source >= n) return dist;
    const queue = [source];
    let head = 0;
    dist[source] = 0;
    while (head < queue.length) {
      const u = queue[head++];
      for (const v of adj[u]) {
        if (dist[v] === -1) {
          dist[v] = dist[u] + 1;
          queue.push(v);
        }
      }
    }
    return dist;
  }
}
