class SatisfiabilityOfEqualityEquations {
    private static class DSU {
        int[] parent = new int[26];
        DSU() {
            for (int i = 0; i < 26; i += 1) {
                parent[i] = i;
            }
        }
        int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        }
        void union(int a, int b) {
            int ra = find(a);
            int rb = find(b);
            if (ra != rb) {
                parent[rb] = ra;
            }
        }
    }

    public boolean equationsPossible(String[] equations) {
        DSU dsu = new DSU();
        for (String eq : equations) {
            if (eq.charAt(1) == '=') {
                int a = eq.charAt(0) - 'a';
                int b = eq.charAt(3) - 'a';
                dsu.union(a, b);
            }
        }
        for (String eq : equations) {
            if (eq.charAt(1) == '!') {
                int a = eq.charAt(0) - 'a';
                int b = eq.charAt(3) - 'a';
                if (dsu.find(a) == dsu.find(b)) {
                    return false;
                }
            }
        }
        return true;
    }
}
