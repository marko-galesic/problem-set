class MaxAreaOfIsland {
  maxAreaOfIsland(grid) {
    if (!grid || grid.length === 0 || grid[0].length === 0) {
      return 0;
    }
    const m = grid.length;
    const n = grid[0].length;
    const seen = Array.from({ length: m }, () => Array(n).fill(false));
    const dfs = (i, j) => {
      if (i < 0 || i >= m || j < 0 || j >= n) {
        return 0;
      }
      if (seen[i][j] || grid[i][j] === 0) {
        return 0;
      }
      seen[i][j] = true;
      return 1 + dfs(i + 1, j) + dfs(i - 1, j) + dfs(i, j + 1) + dfs(i, j - 1);
    };
    let best = 0;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (grid[i][j] === 1 && !seen[i][j]) {
          best = Math.max(best, dfs(i, j));
        }
      }
    }
    return best;
  }
}
