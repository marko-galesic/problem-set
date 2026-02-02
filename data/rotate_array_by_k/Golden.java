import java.util.*;

class RotateArrayByK {
    public int[] rotateArrayByK(int[] nums, int k) {
        if (nums == null || nums.length == 0) {
            return new int[0];
        }
        int n = nums.length;
        int shift = k % n;
        int[] result = new int[n];
        for (int i = 0; i < n; i++) {
            result[(i + shift) % n] = nums[i];
        }
        return result;
    }
}