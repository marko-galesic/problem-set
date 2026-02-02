import java.util.*;

class LongestSubarrayAtMostKDistinct {
    public int longestSubarrayAtMostKDistinct(int[] nums, int k) {
        if (nums == null || k <= 0) {
            return 0;
        }
        Map<Integer, Integer> counts = new HashMap<>();
        int left = 0;
        int best = 0;
        for (int right = 0; right < nums.length; right++) {
            counts.put(nums[right], counts.getOrDefault(nums[right], 0) + 1);
            while (counts.size() > k) {
                int val = nums[left];
                int next = counts.get(val) - 1;
                if (next == 0) {
                    counts.remove(val);
                } else {
                    counts.put(val, next);
                }
                left++;
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}