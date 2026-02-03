import java.util.*;

class ZeroOneMatrix {
    public int[][] updateMatrix(int[][] mat) {
        if (mat == null) {
            return null;
        }
        int rows = mat.length;
        if (rows == 0) {
            return new int[0][0];
        }
        int cols = mat[0].length;
        int[][] dist = new int[rows][cols];
        for (int r = 0; r < rows; r++) {
            Arrays.fill(dist[r], -1);
        }
        Queue<int[]> queue = new ArrayDeque<>();
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (mat[r][c] == 0) {
                    dist[r][c] = 0;
                    queue.offer(new int[] { r, c });
                }
            }
        }
        int[][] dirs = { { 1, 0 }, { -1, 0 }, { 0, 1 }, { 0, -1 } };
        while (!queue.isEmpty()) {
            int[] cell = queue.poll();
            int r = cell[0];
            int c = cell[1];
            for (int[] d : dirs) {
                int nr = r + d[0];
                int nc = c + d[1];
                if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) {
                    continue;
                }
                if (dist[nr][nc] != -1) {
                    continue;
                }
                dist[nr][nc] = dist[r][c] + 1;
                queue.offer(new int[] { nr, nc });
            }
        }
        return dist;
    }
}
