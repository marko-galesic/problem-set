class CoinChangeMinCoins {
  coinChangeMinCoins(coins, amount) {
    const max = amount + 1;
    const dp = new Array(amount + 1).fill(max);
    dp[0] = 0;
    for (let i = 1; i <= amount; i++) {
      for (const coin of coins) {
        if (i - coin >= 0) {
          dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
      }
    }
    return dp[amount] > amount ? -1 : dp[amount];
  }
}
