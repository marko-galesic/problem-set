class LexicographicallySmallestEquivalentString {
    private int[] parent = new int[26];

    private int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    private void union(int a, int b) {
        int ra = find(a);
        int rb = find(b);
        if (ra == rb) {
            return;
        }
        if (ra < rb) {
            parent[rb] = ra;
        } else {
            parent[ra] = rb;
        }
    }

    public String smallestEquivalentString(String s1, String s2, String baseStr) {
        for (int i = 0; i < 26; i += 1) {
            parent[i] = i;
        }
        for (int i = 0; i < s1.length(); i += 1) {
            union(s1.charAt(i) - 'a', s2.charAt(i) - 'a');
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < baseStr.length(); i += 1) {
            int root = find(baseStr.charAt(i) - 'a');
            sb.append((char) ('a' + root));
        }
        return sb.toString();
    }
}
