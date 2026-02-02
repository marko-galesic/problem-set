class WordBreak {
  wordBreak(s, wordDict) {
    if (s === null || s === undefined) {
      return false;
    }
    const dict = new Set(wordDict || []);
    const dp = new Array(s.length + 1).fill(false);
    dp[0] = true;
    for (let i = 1; i <= s.length; i++) {
      for (let j = 0; j < i; j++) {
        if (dp[j] && dict.has(s.slice(j, i))) {
          dp[i] = true;
          break;
        }
      }
    }
    return dp[s.length];
  }
}
