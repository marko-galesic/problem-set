import java.util.*;

class NumberOfEnclaves {
    public int numEnclaves(int[][] grid) {
        int rows = grid.length;
        int cols = rows == 0 ? 0 : grid[0].length;
        boolean[][] visited = new boolean[rows][cols];
        Deque<int[]> queue = new ArrayDeque<>();
        int[][] dirs = new int[][] { {1,0}, {-1,0}, {0,1}, {0,-1} };

        for (int r = 0; r < rows; r++) {
            if (grid[r][0] == 1) {
                queue.add(new int[] { r, 0 });
                visited[r][0] = true;
            }
            if (cols > 1 && grid[r][cols - 1] == 1 && !visited[r][cols - 1]) {
                queue.add(new int[] { r, cols - 1 });
                visited[r][cols - 1] = true;
            }
        }
        for (int c = 0; c < cols; c++) {
            if (grid[0][c] == 1 && !visited[0][c]) {
                queue.add(new int[] { 0, c });
                visited[0][c] = true;
            }
            if (rows > 1 && grid[rows - 1][c] == 1 && !visited[rows - 1][c]) {
                queue.add(new int[] { rows - 1, c });
                visited[rows - 1][c] = true;
            }
        }

        while (!queue.isEmpty()) {
            int[] cell = queue.poll();
            for (int[] d : dirs) {
                int nr = cell[0] + d[0];
                int nc = cell[1] + d[1];
                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
                    continue;
                }
                if (grid[nr][nc] == 1 && !visited[nr][nc]) {
                    visited[nr][nc] = true;
                    queue.add(new int[] { nr, nc });
                }
            }
        }

        int count = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 1 && !visited[r][c]) {
                    count++;
                }
            }
        }
        return count;
    }
}
