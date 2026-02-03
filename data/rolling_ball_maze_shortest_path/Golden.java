import java.util.*;

class RollingBallMazeShortestPath {
    public int shortestDistance(int[][] maze, int[] start, int[] destination) {
        if (maze == null || maze.length == 0) {
            return -1;
        }
        int rows = maze.length;
        int cols = maze[0].length;
        int sr = start[0];
        int sc = start[1];
        int tr = destination[0];
        int tc = destination[1];
        if (sr == tr && sc == tc) {
            return 0;
        }
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
                if (r == tr && c == tc) {
                    return steps;
                }
                for (int[] d : dirs) {
                    int nr = r;
                    int nc = c;
                    while (true) {
                        int rr = nr + d[0];
                        int cc = nc + d[1];
                        if (rr < 0 || cc < 0 || rr >= rows || cc >= cols || maze[rr][cc] == 1) {
                            break;
                        }
                        nr = rr;
                        nc = cc;
                    }
                    if (!visited[nr][nc]) {
                        visited[nr][nc] = true;
                        queue.offer(new int[] { nr, nc });
                    }
                }
            }
            steps++;
        }
        return -1;
    }
}
