import java.util.*;

class EqualRowAndColumnPairs {
    public int equalPairs(int[][] grid) {
        int n = grid.length;
        Map<String, Integer> rowCounts = new HashMap<>();
        for (int r = 0; r < n; r++) {
            String key = Arrays.toString(grid[r]);
            rowCounts.put(key, rowCounts.getOrDefault(key, 0) + 1);
        }
        int total = 0;
        for (int c = 0; c < n; c++) {
            int[] col = new int[n];
            for (int r = 0; r < n; r++) {
                col[r] = grid[r][c];
            }
            String key = Arrays.toString(col);
            total += rowCounts.getOrDefault(key, 0);
        }
        return total;
    }
}
