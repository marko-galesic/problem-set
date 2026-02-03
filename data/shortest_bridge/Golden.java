import java.util.*;

class ShortestBridge {
    public int shortestBridge(int[][] grid) {
        int rows = grid.length;
        int cols = rows == 0 ? 0 : grid[0].length;
        boolean[][] visited = new boolean[rows][cols];
        Deque<int[]> queue = new ArrayDeque<>();
        int[][] dirs = new int[][] { {1,0}, {-1,0}, {0,1}, {0,-1} };

        class Marker {
            void dfs(int r, int c) {
                if (r < 0 || r >= rows || c < 0 || c >= cols) {
                    return;
                }
                if (visited[r][c] || grid[r][c] == 0) {
                    return;
                }
                visited[r][c] = true;
                queue.add(new int[] { r, c });
                for (int[] d : dirs) {
                    dfs(r + d[0], c + d[1]);
                }
            }
        }
        Marker marker = new Marker();
        boolean found = false;
        for (int r = 0; r < rows && !found; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 1) {
                    marker.dfs(r, c);
                    found = true;
                    break;
                }
            }
        }

        int steps = 0;
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                int[] cell = queue.poll();
                for (int[] d : dirs) {
                    int nr = cell[0] + d[0];
                    int nc = cell[1] + d[1];
                    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
                        continue;
                    }
                    if (visited[nr][nc]) {
                        continue;
                    }
                    if (grid[nr][nc] == 1) {
                        return steps;
                    }
                    visited[nr][nc] = true;
                    queue.add(new int[] { nr, nc });
                }
            }
            steps++;
        }
        return -1;
    }
}
