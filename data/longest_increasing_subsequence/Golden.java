import java.util.*;

class LongestIncreasingSubsequence {
    public int lengthOfLIS(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        int[] tails = new int[nums.length];
        int size = 0;
        for (int num : nums) {
            int i = Arrays.binarySearch(tails, 0, size, num);
            if (i < 0) {
                i = -(i + 1);
            }
            tails[i] = num;
            if (i == size) {
                size++;
            }
        }
        return size;
    }
}
