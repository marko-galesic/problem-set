class NumberOfClosedIslands {
  numberOfClosedIslands(grid) {
    if (!grid || grid.length === 0 || grid[0].length === 0) {
      return 0;
    }
    const m = grid.length;
    const n = grid[0].length;
    const seen = Array.from({ length: m }, () => Array(n).fill(false));
    const dfs = (i, j) => {
      if (i < 0 || i >= m || j < 0 || j >= n) {
        return false;
      }
      if (grid[i][j] === 1 || seen[i][j]) {
        return true;
      }
      seen[i][j] = true;
      const up = dfs(i - 1, j);
      const down = dfs(i + 1, j);
      const left = dfs(i, j - 1);
      const right = dfs(i, j + 1);
      return up && down && left && right;
    };
    let count = 0;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (grid[i][j] === 0 && !seen[i][j]) {
          if (dfs(i, j)) {
            count++;
          }
        }
      }
    }
    return count;
  }
}
