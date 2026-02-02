import java.util.*;

class SubarraySumDivisibleByK {
    public int subarraySumDivisibleByK(int[] nums, int k) {
        if (nums == null || k == 0) {
            return 0;
        }
        Map<Integer, Integer> counts = new HashMap<>();
        counts.put(0, 1);
        int sum = 0;
        int total = 0;
        for (int n : nums) {
            sum = (sum + n) % k;
            if (sum < 0) {
                sum += k;
            }
            int have = counts.getOrDefault(sum, 0);
            total += have;
            counts.put(sum, have + 1);
        }
        return total;
    }
}