import java.util.Arrays;

class YouTubeAds {
    public int maxPayout(int[][] ads) {
        if (ads == null || ads.length == 0) {
            return 0;
        }

        int[][] sorted = new int[ads.length][];
        for (int i = 0; i < ads.length; i++) {
            sorted[i] = Arrays.copyOf(ads[i], ads[i].length);
        }
        Arrays.sort(sorted, (a, b) -> Integer.compare(a[1], b[1]));

        int[] ends = new int[sorted.length];
        int[] dp = new int[sorted.length + 1];
        for (int i = 0; i < sorted.length; i++) {
            ends[i] = sorted[i][1];
        }

        for (int i = 1; i <= sorted.length; i++) {
            int compatibleCount = upperBound(ends, i - 1, sorted[i - 1][0]);
            dp[i] = Math.max(dp[i - 1], sorted[i - 1][2] + dp[compatibleCount]);
        }
        return dp[sorted.length];
    }

    private int upperBound(int[] values, int endExclusive, int target) {
        int low = 0;
        int high = endExclusive;
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (values[mid] <= target) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        return low;
    }
}

