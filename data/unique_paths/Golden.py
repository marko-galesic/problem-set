class UniquePaths:
    def uniquePaths(self, m, n):
        if m <= 0 or n <= 0:
            return 0
        dp = [1] * n
        for _ in range(1, m):
            for j in range(1, n):
                dp[j] += dp[j - 1]
        return dp[-1]
