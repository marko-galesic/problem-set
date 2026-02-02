import java.util.*;

class KClosestPointsToOrigin {
    public int[][] kClosest(int[][] points, int k) {
        if (points == null || k <= 0) {
            return new int[0][0];
        }
        int[][] sorted = Arrays.copyOf(points, points.length);
        Arrays.sort(sorted, (a, b) -> {
            long da = 1L * a[0] * a[0] + 1L * a[1] * a[1];
            long db = 1L * b[0] * b[0] + 1L * b[1] * b[1];
            if (da != db) {
                return Long.compare(da, db);
            }
            if (a[0] != b[0]) {
                return Integer.compare(a[0], b[0]);
            }
            return Integer.compare(a[1], b[1]);
        });
        int limit = Math.min(k, sorted.length);
        int[][] result = new int[limit][2];
        for (int i = 0; i < limit; i++) {
            result[i][0] = sorted[i][0];
            result[i][1] = sorted[i][1];
        }
        return result;
    }
}
