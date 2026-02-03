class MinimumFallingPathSum:
    def minFallingPathSum(self, matrix):
        if not matrix:
            return 0
        rows = len(matrix)
        cols = len(matrix[0])
        dp = matrix[0][:]
        for r in range(1, rows):
            next_dp = [0] * cols
            for c in range(cols):
                best = dp[c]
                if c > 0:
                    best = min(best, dp[c - 1])
                if c + 1 < cols:
                    best = min(best, dp[c + 1])
                next_dp[c] = best + matrix[r][c]
            dp = next_dp
        return min(dp)
