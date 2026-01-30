import java.util.*;

class FirstNonRepeatingChar {
    public int firstNonRepeatingChar(String s) {
        if (s == null || s.length() == 0) {
            return -1;
        }
        Map<Character, Integer> counts = new HashMap<>();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            counts.put(c, counts.getOrDefault(c, 0) + 1);
        }
        for (int i = 0; i < s.length(); i++) {
            if (counts.get(s.charAt(i)) == 1) {
                return i;
            }
        }
        return -1;
    }
}
