import java.util.*;

class RemoveAdjacentKDuplicates {
    public String removeAdjacentKDuplicates(String s, int k) {
        if (s == null || s.isEmpty()) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        int[] counts = new int[s.length()];
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            sb.append(ch);
            int last = sb.length() - 1;
            if (last > 0 && sb.charAt(last - 1) == ch) {
                counts[last] = counts[last - 1] + 1;
            } else {
                counts[last] = 1;
            }
            if (counts[last] == k) {
                sb.delete(sb.length() - k, sb.length());
            }
        }
        return sb.toString();
    }
}
