import java.util.*;

class ShortestPathWithPortals {
    public int shortestPathWithPortals(char[][] grid) {
        if (grid == null || grid.length == 0) {
            return -1;
        }
        int rows = grid.length;
        int cols = grid[0].length;
        int sr = -1;
        int sc = -1;
        int tr = -1;
        int tc = -1;
        Map<Character, List<int[]>> portals = new HashMap<>();
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                char ch = grid[r][c];
                if (ch == 'S') {
                    sr = r;
                    sc = c;
                } else if (ch == 'E') {
                    tr = r;
                    tc = c;
                } else if (ch >= 'a' && ch <= 'z') {
                    portals.computeIfAbsent(ch, k -> new ArrayList<>()).add(new int[] { r, c });
                }
            }
        }
        if (sr == -1 || tr == -1) {
            return -1;
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
                    int nr = r + d[0];
                    int nc = c + d[1];
                    if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) {
                        continue;
                    }
                    char next = grid[nr][nc];
                    if (next == '#') {
                        continue;
                    }
                    int fr = nr;
                    int fc = nc;
                    if (next >= 'a' && next <= 'z') {
                        List<int[]> list = portals.get(next);
                        if (list != null && list.size() == 2) {
                            int[] first = list.get(0);
                            int[] second = list.get(1);
                            if (first[0] == nr && first[1] == nc) {
                                fr = second[0];
                                fc = second[1];
                            } else {
                                fr = first[0];
                                fc = first[1];
                            }
                        }
                    }
                    if (!visited[fr][fc]) {
                        visited[fr][fc] = true;
                        queue.offer(new int[] { fr, fc });
                    }
                }
            }
            steps++;
        }
        return -1;
    }
}
