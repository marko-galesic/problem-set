class UniquePathsWithObstacles:
    def uniquePathsWithObstacles(self, grid):
        if grid is None or len(grid) == 0 or len(grid[0]) == 0:
            return 0
        m = len(grid)
        n = len(grid[0])
        dp = [0] * n
        dp[0] = 0 if grid[0][0] == 1 else 1
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 1:
                    dp[j] = 0
                elif j > 0:
                    dp[j] += dp[j - 1]
        return dp[n - 1]
