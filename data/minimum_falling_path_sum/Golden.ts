class MinimumFallingPathSum {
  minFallingPathSum(matrix) {
    if (!matrix || matrix.length === 0) {
      return 0;
    }
    const rows = matrix.length;
    const cols = matrix[0].length;
    let dp = matrix[0].slice();
    for (let r = 1; r < rows; r++) {
      const next = new Array(cols).fill(0);
      for (let c = 0; c < cols; c++) {
        let best = dp[c];
        if (c > 0) {
          best = Math.min(best, dp[c - 1]);
        }
        if (c + 1 < cols) {
          best = Math.min(best, dp[c + 1]);
        }
        next[c] = best + matrix[r][c];
      }
      dp = next;
    }
    return Math.min(...dp);
  }
}
