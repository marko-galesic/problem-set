import java.util.*;

class MaxProductSubarray {
    public int maxProductSubarray(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        int maxProd = nums[0];
        int minProd = nums[0];
        int best = nums[0];
        for (int i = 1; i < nums.length; i++) {
            int n = nums[i];
            if (n < 0) {
                int tmp = maxProd;
                maxProd = minProd;
                minProd = tmp;
            }
            maxProd = Math.max(n, maxProd * n);
            minProd = Math.min(n, minProd * n);
            best = Math.max(best, maxProd);
        }
        return best;
    }
}