import java.util.*;

class LongestMountainInArray {
    public int longestMountainInArray(int[] nums) {
        if (nums == null || nums.length < 3) {
            return 0;
        }
        int n = nums.length;
        int best = 0;
        int i = 1;
        while (i < n - 1) {
            if (nums[i - 1] < nums[i] && nums[i] > nums[i + 1]) {
                int left = i - 1;
                int right = i + 1;
                while (left > 0 && nums[left - 1] < nums[left]) {
                    left--;
                }
                while (right < n - 1 && nums[right] > nums[right + 1]) {
                    right++;
                }
                best = Math.max(best, right - left + 1);
                i = right;
            }
            i++;
        }
        return best;
    }
}