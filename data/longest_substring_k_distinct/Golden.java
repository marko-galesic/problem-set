import java.util.*;

class LongestSubstringKDistinct {
    public int longestSubstringKDistinct(String s, int k) {
        if (s == null || k <= 0) {
            return 0;
        }
        Map<Character, Integer> counts = new HashMap<>();
        int left = 0;
        int best = 0;
        for (int right = 0; right < s.length(); right++) {
            char ch = s.charAt(right);
            counts.put(ch, counts.getOrDefault(ch, 0) + 1);
            while (counts.size() > k) {
                char c = s.charAt(left);
                int next = counts.get(c) - 1;
                if (next == 0) {
                    counts.remove(c);
                } else {
                    counts.put(c, next);
                }
                left++;
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}