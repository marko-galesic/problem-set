class ShortestPathWithObstaclesElimination {
  shortestPath(grid, k) {
    if (!Array.isArray(grid) || grid.length === 0) return -1;
    const rows = grid.length;
    const cols = grid[0].length;
    let startRemaining = k - grid[0][0];
    if (startRemaining < 0) return -1;
    if (rows === 1 && cols === 1) return 0;
    const best = Array.from({ length: rows }, () => Array(cols).fill(-1));
    const queue = [[0, 0, startRemaining]];
    let head = 0;
    best[0][0] = startRemaining;
    let steps = 0;
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    while (head < queue.length) {
      const size = queue.length - head;
      for (let i = 0; i < size; i++) {
        const [r, c, remaining] = queue[head++];
        if (r === rows - 1 && c === cols - 1) return steps;
        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
          const nextRemaining = remaining - grid[nr][nc];
          if (nextRemaining < 0) continue;
          if (best[nr][nc] >= nextRemaining) continue;
          best[nr][nc] = nextRemaining;
          queue.push([nr, nc, nextRemaining]);
        }
      }
      steps++;
    }
    return -1;
  }
}
