import java.util.*;

class ShortestPathInBinaryMatrix {
    public int shortestPathBinaryMatrix(int[][] grid) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return -1;
        }
        int rows = grid.length;
        int cols = grid[0].length;
        if (grid[0][0] != 0 || grid[rows - 1][cols - 1] != 0) {
            return -1;
        }
        int[][] directions = {
            {-1, -1}, {-1, 0}, {-1, 1},
            {0, -1}, {0, 1},
            {1, -1}, {1, 0}, {1, 1}
        };
        boolean[][] visited = new boolean[rows][cols];
        ArrayDeque<int[]> queue = new ArrayDeque<>();
        queue.add(new int[] {0, 0, 1});
        visited[0][0] = true;
        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int r = current[0];
            int c = current[1];
            int dist = current[2];
            if (r == rows - 1 && c == cols - 1) {
                return dist;
            }
            for (int[] dir : directions) {
                int nr = r + dir[0];
                int nc = c + dir[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && grid[nr][nc] == 0) {
                    visited[nr][nc] = true;
                    queue.add(new int[] {nr, nc, dist + 1});
                }
            }
        }
        return -1;
    }
}
