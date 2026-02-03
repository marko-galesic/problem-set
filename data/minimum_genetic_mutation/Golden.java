import java.util.*;

class MinimumGeneticMutation {
    public int minMutation(String start, String end, String[] bank) {
        if (start == null || end == null) {
            return -1;
        }
        if (start.equals(end)) {
            return 0;
        }
        Set<String> wordSet = new HashSet<>();
        if (bank != null) {
            wordSet.addAll(Arrays.asList(bank));
        }
        if (!wordSet.contains(end)) {
            return -1;
        }
        char[] genes = { 'A', 'C', 'G', 'T' };
        Queue<String> queue = new ArrayDeque<>();
        queue.offer(start);
        int steps = 0;
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                String word = queue.poll();
                if (word.equals(end)) {
                    return steps;
                }
                char[] chars = word.toCharArray();
                for (int p = 0; p < chars.length; p++) {
                    char original = chars[p];
                    for (char g : genes) {
                        if (g == original) {
                            continue;
                        }
                        chars[p] = g;
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
        return -1;
    }
}
