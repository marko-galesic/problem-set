import java.util.*;

class PartitionLabels {
    public int[] partitionLabels(String s) {
        if (s == null) {
            return new int[0];
        }
        int[] last = new int[26];
        for (int i = 0; i < s.length(); i++) {
            last[s.charAt(i) - 'a'] = i;
        }
        List<Integer> sizes = new ArrayList<>();
        int start = 0;
        int end = 0;
        for (int i = 0; i < s.length(); i++) {
            end = Math.max(end, last[s.charAt(i) - 'a']);
            if (i == end) {
                sizes.add(end - start + 1);
                start = i + 1;
            }
        }
        int[] result = new int[sizes.size()];
        for (int i = 0; i < sizes.size(); i++) {
            result[i] = sizes.get(i);
        }
        return result;
    }
}
