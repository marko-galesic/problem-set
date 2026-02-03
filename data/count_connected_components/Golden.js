class CountConnectedComponents {
  countComponents(n, edges) {
    if (n <= 0) return 0;
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
    const visited = Array(n).fill(false);
    let components = 0;
    for (let i = 0; i < n; i++) {
      if (visited[i]) continue;
      components++;
      const queue = [i];
      let head = 0;
      visited[i] = true;
      while (head < queue.length) {
        const u = queue[head++];
        for (const v of adj[u]) {
          if (!visited[v]) {
            visited[v] = true;
            queue.push(v);
          }
        }
      }
    }
    return components;
  }
}
