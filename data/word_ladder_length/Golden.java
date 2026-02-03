import java.util.*;

class WordLadderLength {
    public int ladderLength(String beginWord, String endWord, String[] wordList) {
        if (beginWord == null || endWord == null) {
            return 0;
        }
        if (beginWord.equals(endWord)) {
            return 1;
        }
        Set<String> wordSet = new HashSet<>();
        if (wordList != null) {
            wordSet.addAll(Arrays.asList(wordList));
        }
        if (!wordSet.contains(endWord)) {
            return 0;
        }
        Queue<String> queue = new ArrayDeque<>();
        queue.offer(beginWord);
        int steps = 1;
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                String word = queue.poll();
                if (word.equals(endWord)) {
                    return steps;
                }
                char[] chars = word.toCharArray();
                for (int p = 0; p < chars.length; p++) {
                    char original = chars[p];
                    for (char c = 'a'; c <= 'z'; c++) {
                        if (c == original) {
                            continue;
                        }
                        chars[p] = c;
                        String next = new String(chars);
                        if (wordSet.contains(next)) {
                            wordSet.remove(next);
                            queue.offer(next);
                        }
                    }
                    chars[p] = original;
                }
            }
            steps++;
        }
        return 0;
    }
}
