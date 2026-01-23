import java.util.*;

class TopKFrequentElements {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }

        @SuppressWarnings("unchecked")
        List<Integer>[] buckets = new List[nums.length + 1];
        for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
            int count = entry.getValue();
            if (buckets[count] == null) {
                buckets[count] = new ArrayList<>();
            }
            buckets[count].add(entry.getKey());
        }

        int[] result = new int[k];
        int idx = 0;
        for (int count = buckets.length - 1; count >= 0 && idx < k; count--) {
            if (buckets[count] == null) {
                continue;
            }
            for (int value : buckets[count]) {
                result[idx++] = value;
                if (idx == k) {
                    break;
                }
            }
        }

        return result;
    }
}
