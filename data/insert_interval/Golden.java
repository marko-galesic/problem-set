import java.util.*;

class InsertInterval {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        if (intervals == null || intervals.length == 0) {
            return new int[][] { newInterval };
        }

        List<int[]> merged = new ArrayList<>();
        int i = 0;
        int start = newInterval[0];
        int end = newInterval[1];

        while (i < intervals.length && intervals[i][1] < start) {
            merged.add(intervals[i]);
            i++;
        }

        while (i < intervals.length && intervals[i][0] <= end) {
            start = Math.min(start, intervals[i][0]);
            end = Math.max(end, intervals[i][1]);
            i++;
        }

        merged.add(new int[] { start, end });

        while (i < intervals.length) {
            merged.add(intervals[i]);
            i++;
        }

        int[][] output = new int[merged.size()][2];
        for (int j = 0; j < merged.size(); j++) {
            output[j] = merged.get(j);
        }
        return output;
    }
}
