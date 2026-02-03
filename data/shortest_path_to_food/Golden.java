import java.util.*;

class ShortestPathToFood {
    public int shortestPathToFood(char[][] grid) {
        if (grid == null || grid.length == 0) {
            return -1;
        }
        int rows = grid.length;
        int cols = grid[0].length;
        int sr = -1;
        int sc = -1;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == '*') {
                    sr = r;
                    sc = c;
                }
            }
        }
        if (sr == -1) {
            return -1;
        }
        Queue<int[]> queue = new ArrayDeque<>();
        boolean[][] visited = new boolean[rows][cols];
        queue.offer(new int[] { sr, sc });
        visited[sr][sc] = true;
        int steps = 0;
        int[][] dirs = { { 1, 0 }, { -1, 0 }, { 0, 1 }, { 0, -1 } };
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                int[] cell = queue.poll();
                int r = cell[0];
                int c = cell[1];
                if (grid[r][c] == '#') {
                    return steps;
                }
                for (int[] d : dirs) {
                    int nr = r + d[0];
                    int nc = c + d[1];
                    if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) {
                        continue;
                    }
                    if (visited[nr][nc] || grid[nr][nc] == 'X') {
                        continue;
                    }
                    if (grid[nr][nc] == '#') {
                        return steps + 1;
                    }
                    visited[nr][nc] = true;
                    queue.offer(new int[] { nr, nc });
                }
            }
            steps++;
        }
        return -1;
    }
}
