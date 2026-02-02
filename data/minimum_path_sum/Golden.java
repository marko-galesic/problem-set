class MinimumPathSum {
    public int minPathSum(int[][] grid) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return 0;
        }
        int rows = grid.length;
        int cols = grid[0].length;
        int[] dp = new int[cols];
        dp[0] = grid[0][0];
        for (int j = 1; j < cols; j++) {
            dp[j] = dp[j - 1] + grid[0][j];
        }
        for (int i = 1; i < rows; i++) {
            dp[0] += grid[i][0];
            for (int j = 1; j < cols; j++) {
                dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j];
            }
        }
        return dp[cols - 1];
    }
}
