import java.util.*;

class CheckSubarraySumMultipleOfK {
    public boolean checkSubarraySum(int[] nums, int k) {
        if (nums == null || nums.length < 2) {
            return false;
        }
        if (k == 0) {
            for (int i = 1; i < nums.length; i++) {
                if (nums[i] == 0 && nums[i - 1] == 0) {
                    return true;
                }
            }
            return false;
        }
        Map<Integer, Integer> first = new HashMap<>();
        first.put(0, -1);
        int sum = 0;
        for (int i = 0; i < nums.length; i++) {
            sum += nums[i];
            int mod = sum % k;
            if (mod < 0) {
                mod += k;
            }
            if (first.containsKey(mod)) {
                if (i - first.get(mod) >= 2) {
                    return true;
                }
            } else {
                first.put(mod, i);
            }
        }
        return false;
    }
}
