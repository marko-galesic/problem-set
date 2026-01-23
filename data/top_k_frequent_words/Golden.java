import java.util.*;

class TopKFrequentWords {
    public String[] topKFrequent(String[] words, int k) {
        Map<String, Integer> freq = new HashMap<>();
        for (String word : words) {
            freq.put(word, freq.getOrDefault(word, 0) + 1);
        }

        List<String> unique = new ArrayList<>(freq.keySet());
        unique.sort((a, b) -> {
            int fa = freq.get(a);
            int fb = freq.get(b);
            if (fa != fb) {
                return Integer.compare(fb, fa);
            }
            return a.compareTo(b);
        });

        String[] result = new String[k];
        for (int i = 0; i < k; i++) {
            result[i] = unique.get(i);
        }
        return result;
    }
}
