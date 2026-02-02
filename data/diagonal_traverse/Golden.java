import java.util.*;

class DiagonalTraverse {
    public int[] diagonalTraverse(int[][] matrix) {
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            return new int[0];
        }
        int m = matrix.length;
        int n = matrix[0].length;
        int[] result = new int[m * n];
        int idx = 0;
        for (int d = 0; d < m + n - 1; d++) {
            List<Integer> temp = new ArrayList<>();
            int r = d < n ? 0 : d - n + 1;
            int c = d < n ? d : n - 1;
            while (r < m && c >= 0) {
                temp.add(matrix[r][c]);
                r++;
                c--;
            }
            if (d % 2 == 0) {
                for (int i = temp.size() - 1; i >= 0; i--) {
                    result[idx++] = temp.get(i);
                }
            } else {
                for (int val : temp) {
                    result[idx++] = val;
                }
            }
        }
        return result;
    }
}