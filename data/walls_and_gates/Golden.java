import java.util.*;

class WallsAndGates {
    public int[][] wallsAndGates(int[][] rooms) {
        if (rooms == null) {
            return null;
        }
        if (rooms.length == 0) {
            return new int[0][0];
        }
        int rows = rooms.length;
        int cols = rooms[0].length;
        Queue<int[]> queue = new ArrayDeque<>();
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (rooms[r][c] == 0) {
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
                if (rooms[nr][nc] != 2147483647) {
                    continue;
                }
                rooms[nr][nc] = rooms[r][c] + 1;
                queue.offer(new int[] { nr, nc });
            }
        }
        return rooms;
    }
}
