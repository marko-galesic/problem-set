import java.util.*;

class MinimumDeletionsToMakeStringBalanced {
    public int minimumDeletions(String s) {
        int deletions = 0;
        int countB = 0;
        for (char c : s.toCharArray()) {
            if (c == 'a') {
                deletions = Math.min(deletions + 1, countB);
            } else if (c == 'b') {
                countB++;
            }
        }
        return deletions;
    }
}
