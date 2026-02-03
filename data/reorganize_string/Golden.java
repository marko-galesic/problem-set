import java.util.*;

class ReorganizeString {
    public String reorganizeString(String s) {
        if (s == null || s.isEmpty()) {
            return "";
        }
        Map<Character, Integer> freq = new HashMap<>();
        for (char c : s.toCharArray()) {
            freq.put(c, freq.getOrDefault(c, 0) + 1);
        }
        List<Character> chars = new ArrayList<>(freq.keySet());
        Collections.sort(chars);

        StringBuilder sb = new StringBuilder();
        Character prev = null;
        int n = s.length();
        for (int pos = 0; pos < n; pos++) {
            boolean placed = false;
            for (char c : chars) {
                int count = freq.getOrDefault(c, 0);
                if (count == 0 || (prev != null && c == prev)) {
                    continue;
                }
                freq.put(c, count - 1);
                int remaining = n - pos - 1;
                int maxCount = 0;
                for (char ch : chars) {
                    int value = freq.getOrDefault(ch, 0);
                    if (value > maxCount) {
                        maxCount = value;
                    }
                }
                if (maxCount <= (remaining + 1) / 2) {
                    sb.append(c);
                    prev = c;
                    placed = true;
                    break;
                }
                freq.put(c, count);
            }
            if (!placed) {
                return "";
            }
        }
        return sb.toString();
    }
}
