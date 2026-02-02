class MinimumPathSum:
    def minPathSum(self, grid):
        if not grid or not grid[0]:
            return 0
        rows = len(grid)
        cols = len(grid[0])
        dp = [0] * cols
        dp[0] = grid[0][0]
        for j in range(1, cols):
            dp[j] = dp[j - 1] + grid[0][j]
        for i in range(1, rows):
            dp[0] += grid[i][0]
            for j in range(1, cols):
                dp[j] = min(dp[j], dp[j - 1]) + grid[i][j]
        return dp[-1]
