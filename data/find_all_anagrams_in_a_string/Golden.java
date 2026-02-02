import java.util.*;

class FindAllAnagramsInAString {
    public int[] findAnagrams(String s, String p) {
        if (s == null || p == null || s.length() < p.length()) {
            return new int[0];
        }
        int[] need = new int[26];
        for (int i = 0; i < p.length(); i++) {
            need[p.charAt(i) - 'a']++;
        }
        int[] window = new int[26];
        int required = 0;
        for (int v : need) {
            if (v > 0) {
                required++;
            }
        }
        int matches = 0;
        List<Integer> result = new ArrayList<>();
        int left = 0;
        for (int right = 0; right < s.length(); right++) {
            int idx = s.charAt(right) - 'a';
            window[idx]++;
            if (window[idx] == need[idx]) {
                matches++;
            }
            if (right - left + 1 > p.length()) {
                int leftIdx = s.charAt(left) - 'a';
                if (window[leftIdx] == need[leftIdx]) {
                    matches--;
                }
                window[leftIdx]--;
                left++;
            }
            if (right - left + 1 == p.length() && matches == required) {
                result.add(left);
            }
        }
        int[] output = new int[result.size()];
        for (int i = 0; i < result.size(); i++) {
            output[i] = result.get(i);
        }
        return output;
    }
}
