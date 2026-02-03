import java.util.*;

class LongestCommonSubstring {
    public int longestCommonSubstring(String a, String b) {
        if (a == null || b == null || a.isEmpty() || b.isEmpty()) {
            return 0;
        }
        int m = a.length();
        int n = b.length();
        int[] dp = new int[n + 1];
        int best = 0;
        for (int i = 1; i <= m; i++) {
            int prev = 0;
            for (int j = 1; j <= n; j++) {
                int temp = dp[j];
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    dp[j] = prev + 1;
                    if (dp[j] > best) {
                        best = dp[j];
                    }
                } else {
                    dp[j] = 0;
                }
                prev = temp;
            }
        }
        return best;
    }
}
