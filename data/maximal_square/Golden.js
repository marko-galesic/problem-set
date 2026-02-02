class MaximalSquare {
  maximalSquare(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
      return 0;
    }
    const rows = matrix.length;
    const cols = matrix[0].length;
    const dp = new Array(cols + 1).fill(0);
    let maxSide = 0;
    let prev = 0;
    for (let i = 1; i <= rows; i++) {
      prev = 0;
      for (let j = 1; j <= cols; j++) {
        const temp = dp[j];
        if (matrix[i - 1][j - 1] === '1') {
          dp[j] = Math.min(dp[j], dp[j - 1], prev) + 1;
          if (dp[j] > maxSide) {
            maxSide = dp[j];
          }
        } else {
          dp[j] = 0;
        }
        prev = temp;
      }
    }
    return maxSide * maxSide;
  }
}
