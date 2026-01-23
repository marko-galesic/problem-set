class CoinChange:
    def coinChange(self, coins, amount):
        max_val = amount + 1
        dp = [max_val] * (amount + 1)
        dp[0] = 0
        for i in range(1, amount + 1):
            for coin in coins:
                if coin <= i:
                    dp[i] = min(dp[i], dp[i - coin] + 1)
        return -1 if dp[amount] == max_val else dp[amount]
