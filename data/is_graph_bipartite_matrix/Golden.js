class IsGraphBipartiteMatrix {
  isBipartite(graph) {
    if (!Array.isArray(graph)) return true;
    const n = graph.length;
    const color = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      if (color[i] !== 0) continue;
      const queue = [i];
      let head = 0;
      color[i] = 1;
      while (head < queue.length) {
        const u = queue[head++];
        for (const v of graph[u]) {
          if (color[v] === 0) {
            color[v] = -color[u];
            queue.push(v);
          } else if (color[v] === color[u]) {
            return false;
          }
        }
      }
    }
    return true;
  }
}
