import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

class LongestWordInDictionary {
    private boolean buildable(String word, Set<String> set) {
        for (int i = 1; i < word.length(); i += 1) {
            if (!set.contains(word.substring(0, i))) {
                return false;
            }
        }
        return true;
    }

    public String longestWord(String[] words) {
        Set<String> set = new HashSet<>(Arrays.asList(words));
        String best = "";
        for (String word : words) {
            if (buildable(word, set)) {
                if (word.length() > best.length() || (word.length() == best.length() && word.compareTo(best) < 0)) {
                    best = word;
                }
            }
        }
        return best;
    }
}
