class RedundantConnection {
    private static class DSU {
        int[] parent;
        int[] rank;
        DSU(int n) {
            parent = new int[n + 1];
            rank = new int[n + 1];
            for (int i = 0; i <= n; i += 1) {
                parent[i] = i;
            }
        }
        int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        }
        boolean union(int a, int b) {
            int ra = find(a);
            int rb = find(b);
            if (ra == rb) {
                return false;
            }
            if (rank[ra] < rank[rb]) {
                parent[ra] = rb;
            } else if (rank[ra] > rank[rb]) {
                parent[rb] = ra;
            } else {
                parent[rb] = ra;
                rank[ra] += 1;
            }
            return true;
        }
    }

    public int[] findRedundantConnection(int[][] edges) {
        int max = 0;
        for (int[] edge : edges) {
            max = Math.max(max, Math.max(edge[0], edge[1]));
        }
        DSU dsu = new DSU(max);
        int[] answer = new int[0];
        for (int[] edge : edges) {
            if (!dsu.union(edge[0], edge[1])) {
                answer = new int[] { edge[0], edge[1] };
            }
        }
        return answer;
    }
}
