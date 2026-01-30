import java.util.*;

class IsomorphicStrings {
    public boolean isIsomorphic(String s, String t) {
        if (s.length() != t.length()) {
            return false;
        }
        Map<Character, Character> mapST = new HashMap<>();
        Map<Character, Character> mapTS = new HashMap<>();
        for (int i = 0; i < s.length(); i++) {
            char a = s.charAt(i);
            char b = t.charAt(i);
            if (mapST.containsKey(a) && mapST.get(a) != b) {
                return false;
            }
            if (mapTS.containsKey(b) && mapTS.get(b) != a) {
                return false;
            }
            mapST.put(a, b);
            mapTS.put(b, a);
        }
        return true;
    }
}
