import java.util.*;

class WordLadderPathsCount {
    public int ladderPathCount(String beginWord, String endWord, String[] wordList) {
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
        Map<String, Integer> dist = new HashMap<>();
        Queue<String> queue = new ArrayDeque<>();
        queue.offer(beginWord);
        dist.put(beginWord, 0);
        while (!queue.isEmpty()) {
            String word = queue.poll();
            int d = dist.get(word);
            if (word.equals(endWord)) {
                continue;
            }
            char[] chars = word.toCharArray();
            for (int i = 0; i < chars.length; i++) {
                char original = chars[i];
                for (char c = 'a'; c <= 'z'; c++) {
                    if (c == original) {
                        continue;
                    }
                    chars[i] = c;
                    String next = new String(chars);
                    if (wordSet.contains(next) && !dist.containsKey(next)) {
                        dist.put(next, d + 1);
                        queue.offer(next);
                    }
                }
                chars[i] = original;
            }
        }
        if (!dist.containsKey(endWord)) {
            return 0;
        }
        Map<String, Integer> memo = new HashMap<>();
        return countPaths(beginWord, endWord, wordSet, dist, memo);
    }

    private int countPaths(String word, String endWord, Set<String> wordSet, Map<String, Integer> dist, Map<String, Integer> memo) {
        if (word.equals(endWord)) {
            return 1;
        }
        if (memo.containsKey(word)) {
            return memo.get(word);
        }
        int total = 0;
        int d = dist.getOrDefault(word, Integer.MAX_VALUE);
        char[] chars = word.toCharArray();
        for (int i = 0; i < chars.length; i++) {
            char original = chars[i];
            for (char c = 'a'; c <= 'z'; c++) {
                if (c == original) {
                    continue;
                }
                chars[i] = c;
                String next = new String(chars);
                if (wordSet.contains(next) && dist.getOrDefault(next, Integer.MAX_VALUE) == d + 1) {
                    total += countPaths(next, endWord, wordSet, dist, memo);
                }
            }
            chars[i] = original;
        }
        memo.put(word, total);
        return total;
    }
}
