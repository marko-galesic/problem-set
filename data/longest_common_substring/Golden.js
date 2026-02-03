class LongestCommonSubstring {
  longestCommonSubstring(a, b) {
    if (!a || !b) {
      return 0;
    }
    const n = b.length;
    const dp = new Array(n + 1).fill(0);
    let best = 0;
    for (let i = 1; i <= a.length; i++) {
      let prev = 0;
      for (let j = 1; j <= n; j++) {
        const temp = dp[j];
        if (a[i - 1] === b[j - 1]) {
          dp[j] = prev + 1;
          if (dp[j] > best) {
            best = dp[j];
          }
        } else {
          dp[j] = 0;
        }
        prev = temp;
      }
    }
    return best;
  }
}
