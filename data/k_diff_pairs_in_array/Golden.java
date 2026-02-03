import java.util.*;

class KDiffPairsInArray {
    public int findPairs(int[] nums, int k) {
        if (k < 0) {
            return 0;
        }
        Map<Integer, Integer> freq = new HashMap<>();
        for (int n : nums) {
            freq.put(n, freq.getOrDefault(n, 0) + 1);
        }
        int count = 0;
        if (k == 0) {
            for (int v : freq.values()) {
                if (v > 1) {
                    count++;
                }
            }
            return count;
        }
        for (int n : freq.keySet()) {
            if (freq.containsKey(n + k)) {
                count++;
            }
        }
        return count;
    }
}
