class NumberOfProvinces {
    private static class DSU {
        int[] parent;
        int[] rank;
        DSU(int n) {
            parent = new int[n];
            rank = new int[n];
            for (int i = 0; i < n; i += 1) {
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
            if (ra == rb) {
                return;
            }
            if (rank[ra] < rank[rb]) {
                parent[ra] = rb;
            } else if (rank[ra] > rank[rb]) {
                parent[rb] = ra;
            } else {
                parent[rb] = ra;
                rank[ra] += 1;
            }
        }
    }

    public int findCircleNum(int[][] isConnected) {
        int n = isConnected.length;
        DSU dsu = new DSU(n);
        for (int i = 0; i < n; i += 1) {
            for (int j = i + 1; j < n; j += 1) {
                if (isConnected[i][j] == 1) {
                    dsu.union(i, j);
                }
            }
        }
        int count = 0;
        for (int i = 0; i < n; i += 1) {
            if (dsu.find(i) == i) {
                count += 1;
            }
        }
        return count;
    }
}
