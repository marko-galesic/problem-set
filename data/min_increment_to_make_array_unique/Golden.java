import java.util.*;

class MinIncrementToMakeArrayUnique {
    public int minIncrementForUnique(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        Arrays.sort(nums);
        long moves = 0;
        int next = nums[0];
        for (int val : nums) {
            if (val < next) {
                moves += next - val;
            } else {
                next = val;
            }
            next += 1;
        }
        return (int) moves;
    }
}
