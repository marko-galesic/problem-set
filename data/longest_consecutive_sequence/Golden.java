import java.util.*;

class LongestConsecutiveSequence {
    public int longestConsecutive(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        Set<Integer> set = new HashSet<>();
        for (int n : nums) {
            set.add(n);
        }
        int best = 0;
        for (int n : set) {
            if (!set.contains(n - 1)) {
                int len = 1;
                int cur = n + 1;
                while (set.contains(cur)) {
                    len++;
                    cur++;
                }
                if (len > best) {
                    best = len;
                }
            }
        }
        return best;
    }
}
