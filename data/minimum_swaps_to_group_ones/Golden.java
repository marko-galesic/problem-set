import java.util.*;

class MinimumSwapsToGroupOnes {
    public int minimumSwapsToGroupOnes(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        int ones = 0;
        for (int n : nums) {
            if (n == 1) {
                ones++;
            }
        }
        if (ones <= 1) {
            return 0;
        }
        int zeros = 0;
        for (int i = 0; i < ones; i++) {
            if (nums[i] == 0) {
                zeros++;
            }
        }
        int best = zeros;
        for (int i = ones; i < nums.length; i++) {
            if (nums[i] == 0) {
                zeros++;
            }
            if (nums[i - ones] == 0) {
                zeros--;
            }
            if (zeros < best) {
                best = zeros;
            }
        }
        return best;
    }
}