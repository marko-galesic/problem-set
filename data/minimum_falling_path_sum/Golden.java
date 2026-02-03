import java.util.*;

class MinimumFallingPathSum {
    public int minFallingPathSum(int[][] matrix) {
        if (matrix == null || matrix.length == 0) {
            return 0;
        }
        int rows = matrix.length;
        int cols = matrix[0].length;
        int[] dp = Arrays.copyOf(matrix[0], cols);
        for (int r = 1; r < rows; r++) {
            int[] next = new int[cols];
            for (int c = 0; c < cols; c++) {
                int best = dp[c];
                if (c > 0) {
                    best = Math.min(best, dp[c - 1]);
                }
                if (c + 1 < cols) {
                    best = Math.min(best, dp[c + 1]);
                }
                next[c] = best + matrix[r][c];
            }
            dp = next;
        }
        int answer = dp[0];
        for (int val : dp) {
            answer = Math.min(answer, val);
        }
        return answer;
    }
}
