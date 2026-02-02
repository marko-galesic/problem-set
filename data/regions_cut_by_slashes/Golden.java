import java.util.HashSet;
import java.util.Set;

class RegionsCutBySlashes {
    private static class DSU {
        int[] parent;
        DSU(int n) {
            parent = new int[n];
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
            if (ra != rb) {
                parent[rb] = ra;
            }
        }
    }

    public int regionsBySlashes(String[] grid) {
        int n = grid.length;
        int total = n * n * 4;
        DSU dsu = new DSU(total);

        for (int r = 0; r < n; r += 1) {
            for (int c = 0; c < n; c += 1) {
                int base = (r * n + c) * 4;
                char ch = grid[r].charAt(c);
                if (ch == ' ') {
                    dsu.union(base, base + 1);
                    dsu.union(base + 1, base + 2);
                    dsu.union(base + 2, base + 3);
                } else if (ch == '/') {
                    dsu.union(base, base + 3);
                    dsu.union(base + 1, base + 2);
                } else if (ch == '\\') {
                    dsu.union(base, base + 1);
                    dsu.union(base + 2, base + 3);
                }

                if (r > 0) {
                    int topBase = ((r - 1) * n + c) * 4;
                    dsu.union(base, topBase + 2);
                }
                if (c > 0) {
                    int leftBase = (r * n + (c - 1)) * 4;
                    dsu.union(base + 3, leftBase + 1);
                }
            }
        }

        Set<Integer> roots = new HashSet<>();
        for (int i = 0; i < total; i += 1) {
            roots.add(dsu.find(i));
        }
        return roots.size();
    }
}
