import java.util.*;

class LongestPalindromeLength {
    public int longestPalindromeLength(String s) {
        if (s == null || s.isEmpty()) {
            return 0;
        }
        int[] counts = new int[128];
        for (int i = 0; i < s.length(); i++) {
            counts[s.charAt(i)]++;
        }
        int length = 0;
        boolean odd = false;
        for (int c : counts) {
            length += (c / 2) * 2;
            if (c % 2 == 1) {
                odd = true;
            }
        }
        if (odd) {
            length += 1;
        }
        return length;
    }
}