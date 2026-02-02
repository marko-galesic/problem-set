import java.util.*;

class OneEditDistance {
    public boolean oneEditDistance(String s, String t) {
        if (s == null || t == null) {
            return false;
        }
        if (s.equals(t)) {
            return false;
        }
        if (s.length() > t.length()) {
            String tmp = s;
            s = t;
            t = tmp;
        }
        if (t.length() - s.length() > 1) {
            return false;
        }
        int i = 0;
        int j = 0;
        int diff = 0;
        while (i < s.length() && j < t.length()) {
            if (s.charAt(i) == t.charAt(j)) {
                i++;
                j++;
            } else {
                diff++;
                if (diff > 1) {
                    return false;
                }
                if (s.length() == t.length()) {
                    i++;
                    j++;
                } else {
                    j++;
                }
            }
        }
        return true;
    }
}