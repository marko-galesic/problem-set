import java.util.*;

class SubarraySumEqualsK {
    public int subarraySum(int[] nums, int k) {
        if (nums == null) {
            return 0;
        }
        Map<Integer, Integer> counts = new HashMap<>();
        counts.put(0, 1);
        int sum = 0;
        int total = 0;
        for (int num : nums) {
            sum += num;
            total += counts.getOrDefault(sum - k, 0);
            counts.put(sum, counts.getOrDefault(sum, 0) + 1);
        }
        return total;
    }
}
