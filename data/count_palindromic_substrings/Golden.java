import java.util.*;

class CountPalindromicSubstrings {
    public int countPalindromicSubstrings(String s) {
        if (s == null || s.isEmpty()) {
            return 0;
        }
        int total = 0;
        for (int i = 0; i < s.length(); i++) {
            total += expand(s, i, i);
            total += expand(s, i, i + 1);
        }
        return total;
    }

    private int expand(String s, int left, int right) {
        int count = 0;
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            count++;
            left--;
            right++;
        }
        return count;
    }
}