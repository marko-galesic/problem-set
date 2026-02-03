import java.util.*;

class ShortestPathCollectAllKeys {
    public int shortestPathAllKeys(char[][] grid) {
        if (grid == null || grid.length == 0) {
            return -1;
        }
        int rows = grid.length;
        int cols = grid[0].length;
        int sr = 0;
        int sc = 0;
        int targetMask = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                char ch = grid[r][c];
                if (ch == '@') {
                    sr = r;
                    sc = c;
                } else if (ch >= 'a' && ch <= 'f') {
                    targetMask |= (1 << (ch - 'a'));
                }
            }
        }
        if (targetMask == 0) {
            return 0;
        }
        boolean[][][] visited = new boolean[rows][cols][1 << 6];
        Queue<int[]> queue = new ArrayDeque<>();
        queue.offer(new int[] { sr, sc, 0 });
        visited[sr][sc][0] = true;
        int steps = 0;
        int[][] dirs = { { 1, 0 }, { -1, 0 }, { 0, 1 }, { 0, -1 } };
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                int[] state = queue.poll();
                int r = state[0];
                int c = state[1];
                int mask = state[2];
                if (mask == targetMask) {
                    return steps;
                }
                for (int[] d : dirs) {
                    int nr = r + d[0];
                    int nc = c + d[1];
                    if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) {
                        continue;
                    }
                    char cell = grid[nr][nc];
                    if (cell == '#') {
                        continue;
                    }
                    if (cell >= 'A' && cell <= 'F') {
                        int bit = cell - 'A';
                        if ((mask & (1 << bit)) == 0) {
                            continue;
                        }
                    }
                    int nextMask = mask;
                    if (cell >= 'a' && cell <= 'f') {
                        nextMask |= (1 << (cell - 'a'));
                    }
                    if (!visited[nr][nc][nextMask]) {
                        visited[nr][nc][nextMask] = true;
                        queue.offer(new int[] { nr, nc, nextMask });
                    }
                }
            }
            steps++;
        }
        return -1;
    }
}
