import java.util.*;

class MergeIntervals {
    public int[][] merge(int[][] intervals) {
        if (intervals == null || intervals.length == 0) {
            return new int[0][0];
        }

        Arrays.sort(intervals, (a, b) -> {
            if (a[0] != b[0]) {
                return Integer.compare(a[0], b[0]);
            }
            return Integer.compare(a[1], b[1]);
        });

        List<int[]> merged = new ArrayList<>();
        int[] current = new int[] { intervals[0][0], intervals[0][1] };

        for (int i = 1; i < intervals.length; i++) {
            int start = intervals[i][0];
            int end = intervals[i][1];
            if (start <= current[1]) {
                current[1] = Math.max(current[1], end);
            } else {
                merged.add(current);
                current = new int[] { start, end };
            }
        }

        merged.add(current);

        int[][] output = new int[merged.size()][2];
        for (int i = 0; i < merged.size(); i++) {
            output[i] = merged.get(i);
        }
        return output;
    }
}
