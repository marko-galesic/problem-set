class UniquePathsWithObstacles {
  uniquePathsWithObstacles(grid) {
    if (!grid || grid.length === 0 || grid[0].length === 0) return 0;
    const m = grid.length;
    const n = grid[0].length;
    const dp = new Array(n).fill(0);
    dp[0] = grid[0][0] === 1 ? 0 : 1;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (grid[i][j] === 1) {
          dp[j] = 0;
        } else if (j > 0) {
          dp[j] += dp[j - 1];
        }
      }
    }
    return dp[n - 1];
  }
}
