import java.util.*;

class MaxAreaOfIsland {
    public int maxAreaOfIsland(int[][] grid) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return 0;
        }
        int m = grid.length;
        int n = grid[0].length;
        boolean[][] seen = new boolean[m][n];
        int best = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1 && !seen[i][j]) {
                    best = Math.max(best, dfsIsland(grid, seen, i, j));
                }
            }
        }
        return best;
    }

    private int dfsIsland(int[][] grid, boolean[][] seen, int i, int j) {
        if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length) {
            return 0;
        }
        if (seen[i][j] || grid[i][j] == 0) {
            return 0;
        }
        seen[i][j] = true;
        return 1
            + dfsIsland(grid, seen, i + 1, j)
            + dfsIsland(grid, seen, i - 1, j)
            + dfsIsland(grid, seen, i, j + 1)
            + dfsIsland(grid, seen, i, j - 1);
    }
}