import java.util.*;

class ContiguousArray {
    public int findMaxLength(int[] nums) {
        if (nums == null) {
            return 0;
        }
        Map<Integer, Integer> firstIndex = new HashMap<>();
        firstIndex.put(0, -1);
        int sum = 0;
        int best = 0;
        for (int i = 0; i < nums.length; i++) {
            sum += nums[i] == 1 ? 1 : -1;
            if (firstIndex.containsKey(sum)) {
                best = Math.max(best, i - firstIndex.get(sum));
            } else {
                firstIndex.put(sum, i);
            }
        }
        return best;
    }
}
