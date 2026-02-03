import java.util.*;

class ShortestPathInBinaryMatrix4Dir {
    public int shortestPathBinaryMatrix4Dir(int[][] grid) {
        if (grid == null || grid.length == 0) {
            return -1;
        }
        int rows = grid.length;
        int cols = grid[0].length;
        if (grid[0][0] == 1 || grid[rows - 1][cols - 1] == 1) {
            return -1;
        }
        if (rows == 1 && cols == 1) {
            return 0;
        }
        boolean[][] visited = new boolean[rows][cols];
        Queue<int[]> queue = new ArrayDeque<>();
        queue.offer(new int[] { 0, 0 });
        visited[0][0] = true;
        int steps = 0;
        int[][] dirs = { { 1, 0 }, { -1, 0 }, { 0, 1 }, { 0, -1 } };
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                int[] cell = queue.poll();
                int r = cell[0];
                int c = cell[1];
                if (r == rows - 1 && c == cols - 1) {
                    return steps;
                }
                for (int[] d : dirs) {
                    int nr = r + d[0];
                    int nc = c + d[1];
                    if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) {
                        continue;
                    }
                    if (visited[nr][nc] || grid[nr][nc] == 1) {
                        continue;
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
