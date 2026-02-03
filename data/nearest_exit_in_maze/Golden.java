import java.util.*;

class NearestExitInMaze {
    public int nearestExit(char[][] maze, int[] entrance) {
        if (maze == null || maze.length == 0) {
            return -1;
        }
        int rows = maze.length;
        int cols = maze[0].length;
        int sr = entrance[0];
        int sc = entrance[1];
        boolean[][] visited = new boolean[rows][cols];
        Queue<int[]> queue = new ArrayDeque<>();
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
                if (!(r == sr && c == sc) && (r == 0 || c == 0 || r == rows - 1 || c == cols - 1)) {
                    return steps;
                }
                for (int[] d : dirs) {
                    int nr = r + d[0];
                    int nc = c + d[1];
                    if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) {
                        continue;
                    }
                    if (visited[nr][nc] || maze[nr][nc] == '+') {
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
