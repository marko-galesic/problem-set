import java.util.*;

class CountSubIslands {
    public int countSubIslands(int[][] grid1, int[][] grid2) {
        int rows = grid2.length;
        int cols = rows == 0 ? 0 : grid2[0].length;
        boolean[][] visited = new boolean[rows][cols];
        int[][] dirs = new int[][] { {1,0}, {-1,0}, {0,1}, {0,-1} };

        class Checker {
            boolean dfs(int r, int c) {
                if (r < 0 || r >= rows || c < 0 || c >= cols) {
                    return true;
                }
                if (grid2[r][c] == 0 || visited[r][c]) {
                    return true;
                }
                visited[r][c] = true;
                boolean isSub = grid1[r][c] == 1;
                for (int[] d : dirs) {
                    if (!dfs(r + d[0], c + d[1])) {
                        isSub = false;
                    }
                }
                return isSub;
            }
        }
        Checker checker = new Checker();
        int count = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid2[r][c] == 1 && !visited[r][c]) {
                    if (checker.dfs(r, c)) {
                        count++;
                    }
                }
            }
        }
        return count;
    }
}
