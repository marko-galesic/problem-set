class PrefixAndSuffixSearch {
    public int[] prefixSuffixSearch(String[] words, String[] queries) {
        int[] result = new int[queries.length];
        for (int qi = 0; qi < queries.length; qi += 1) {
            String query = queries[qi];
            int sep = query.indexOf('|');
            String prefix = sep >= 0 ? query.substring(0, sep) : query;
            String suffix = sep >= 0 ? query.substring(sep + 1) : "";
            int best = -1;
            for (int i = 0; i < words.length; i += 1) {
                String word = words[i];
                if (word.startsWith(prefix) && word.endsWith(suffix)) {
                    best = i;
                }
            }
            result[qi] = best;
        }
        return result;
    }
}
