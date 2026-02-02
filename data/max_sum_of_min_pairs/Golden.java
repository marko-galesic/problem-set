import java.util.*;

class MaxSumOfMinPairs {
    public int maxSumOfMinPairs(int[] nums) {
        if (nums == null) {
            return 0;
        }
        Arrays.sort(nums);
        int sum = 0;
        for (int i = 0; i < nums.length; i += 2) {
            sum += nums[i];
        }
        return sum;
    }
}