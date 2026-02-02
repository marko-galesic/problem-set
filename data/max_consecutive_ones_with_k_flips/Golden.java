import java.util.*;

class MaxConsecutiveOnesWithKFlips {
    public int maxConsecutiveOnesWithKFlips(int[] nums, int k) {
        if (nums == null) {
            return 0;
        }
        int left = 0;
        int zeros = 0;
        int best = 0;
        for (int right = 0; right < nums.length; right++) {
            if (nums[right] == 0) {
                zeros++;
            }
            while (zeros > k) {
                if (nums[left] == 0) {
                    zeros--;
                }
                left++;
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}