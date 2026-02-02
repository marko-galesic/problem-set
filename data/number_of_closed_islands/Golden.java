import java.util.*;

class NumberOfClosedIslands {
    public int numberOfClosedIslands(int[][] grid) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return 0;
        }
        int m = grid.length;
        int n = grid[0].length;
        boolean[][] seen = new boolean[m][n];
        int count = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 0 && !seen[i][j]) {
                    if (dfsClosed(grid, seen, i, j)) {
                        count++;
                    }
                }
            }
        }
        return count;
    }

    private boolean dfsClosed(int[][] grid, boolean[][] seen, int i, int j) {
        if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length) {
            return false;
        }
        if (grid[i][j] == 1 || seen[i][j]) {
            return true;
        }
        seen[i][j] = true;
        boolean up = dfsClosed(grid, seen, i - 1, j);
        boolean down = dfsClosed(grid, seen, i + 1, j);
        boolean left = dfsClosed(grid, seen, i, j - 1);
        boolean right = dfsClosed(grid, seen, i, j + 1);
        return up && down && left && right;
    }
}