import java.util.*;

class MatrixBlockSum {
    public int[][] matrixBlockSum(int[][] mat, int k) {
        if (mat == null || mat.length == 0 || mat[0].length == 0) {
            return new int[0][0];
        }
        int m = mat.length;
        int n = mat[0].length;
        int[][] ps = new int[m + 1][n + 1];
        for (int i = 0; i < m; i++) {
            int rowSum = 0;
            for (int j = 0; j < n; j++) {
                rowSum += mat[i][j];
                ps[i + 1][j + 1] = ps[i][j + 1] + rowSum;
            }
        }
        int[][] result = new int[m][n];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                int r1 = Math.max(0, i - k);
                int c1 = Math.max(0, j - k);
                int r2 = Math.min(m - 1, i + k);
                int c2 = Math.min(n - 1, j + k);
                int sum = ps[r2 + 1][c2 + 1] - ps[r1][c2 + 1] - ps[r2 + 1][c1] + ps[r1][c1];
                result[i][j] = sum;
            }
        }
        return result;
    }
}