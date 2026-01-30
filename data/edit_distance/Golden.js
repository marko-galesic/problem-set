class EditDistance {
  editDistance(word1, word2) {
    const m = word1.length;
    const n = word2.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      const c1 = word1[i - 1];
      for (let j = 1; j <= n; j++) {
        const c2 = word2[j - 1];
        if (c1 === c2) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          const replace = dp[i - 1][j - 1];
          const del = dp[i - 1][j];
          const ins = dp[i][j - 1];
          dp[i][j] = 1 + Math.min(replace, del, ins);
        }
      }
    }
    return dp[m][n];
  }
}
