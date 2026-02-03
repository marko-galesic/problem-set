import java.util.*;

class ShortestPathWithObstaclesElimination {
    public int shortestPath(int[][] grid, int k) {
        if (grid == null || grid.length == 0) {
            return -1;
        }
        int rows = grid.length;
        int cols = grid[0].length;
        int startRemaining = k - grid[0][0];
        if (startRemaining < 0) {
            return -1;
        }
        if (rows == 1 && cols == 1) {
            return 0;
        }
        int[][] best = new int[rows][cols];
        for (int r = 0; r < rows; r++) {
            Arrays.fill(best[r], -1);
        }
        Queue<int[]> queue = new ArrayDeque<>();
        queue.offer(new int[] { 0, 0, startRemaining });
        best[0][0] = startRemaining;
        int steps = 0;
        int[][] dirs = { { 1, 0 }, { -1, 0 }, { 0, 1 }, { 0, -1 } };
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                int[] state = queue.poll();
                int r = state[0];
                int c = state[1];
                int remaining = state[2];
                if (r == rows - 1 && c == cols - 1) {
                    return steps;
                }
                for (int[] d : dirs) {
                    int nr = r + d[0];
                    int nc = c + d[1];
                    if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) {
                        continue;
                    }
                    int nextRemaining = remaining - grid[nr][nc];
                    if (nextRemaining < 0) {
                        continue;
                    }
                    if (best[nr][nc] >= nextRemaining) {
                        continue;
                    }
                    best[nr][nc] = nextRemaining;
                    queue.offer(new int[] { nr, nc, nextRemaining });
                }
            }
            steps++;
        }
        return -1;
    }
}
