import java.util.*;

class LongestSubarraySumEqualsK {
    public int longestSubarraySumEqualsK(int[] nums, int k) {
        if (nums == null) {
            return 0;
        }
        Map<Integer, Integer> first = new HashMap<>();
        first.put(0, -1);
        int sum = 0;
        int best = 0;
        for (int i = 0; i < nums.length; i++) {
            sum += nums[i];
            Integer prev = first.get(sum - k);
            if (prev != null) {
                best = Math.max(best, i - prev);
            }
            if (!first.containsKey(sum)) {
                first.put(sum, i);
            }
        }
        return best;
    }
}