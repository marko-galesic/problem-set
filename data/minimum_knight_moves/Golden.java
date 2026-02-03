import java.util.*;

class MinimumKnightMoves {
    public int minKnightMoves(int n, int[] start, int[] end) {
        if (n <= 0) {
            return -1;
        }
        int sr = start[0];
        int sc = start[1];
        int tr = end[0];
        int tc = end[1];
        if (sr == tr && sc == tc) {
            return 0;
        }
        int[][] moves = {
            { 2, 1 }, { 2, -1 }, { -2, 1 }, { -2, -1 },
            { 1, 2 }, { 1, -2 }, { -1, 2 }, { -1, -2 }
        };
        boolean[][] visited = new boolean[n][n];
        Queue<int[]> queue = new ArrayDeque<>();
        queue.offer(new int[] { sr, sc });
        visited[sr][sc] = true;
        int steps = 0;
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                int[] cell = queue.poll();
                int r = cell[0];
                int c = cell[1];
                if (r == tr && c == tc) {
                    return steps;
                }
                for (int[] m : moves) {
                    int nr = r + m[0];
                    int nc = c + m[1];
                    if (nr < 0 || nc < 0 || nr >= n || nc >= n) {
                        continue;
                    }
                    if (visited[nr][nc]) {
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
