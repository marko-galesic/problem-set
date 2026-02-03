import java.util.*;

class MinimumTimeDifference {
    public int findMinDifference(String[] timePoints) {
        int n = timePoints.length;
        int[] minutes = new int[n];
        for (int i = 0; i < n; i++) {
            String t = timePoints[i];
            int hour = Integer.parseInt(t.substring(0, 2));
            int minute = Integer.parseInt(t.substring(3));
            minutes[i] = hour * 60 + minute;
        }
        Arrays.sort(minutes);
        int minDiff = 1440;
        for (int i = 1; i < n; i++) {
            minDiff = Math.min(minDiff, minutes[i] - minutes[i - 1]);
        }
        minDiff = Math.min(minDiff, 1440 - minutes[n - 1] + minutes[0]);
        return minDiff;
    }
}
