import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class SmallestStringWithSwaps {
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

    public String smallestStringWithSwaps(String s, int[][] pairs) {
        int n = s.length();
        DSU dsu = new DSU(n);
        for (int[] pair : pairs) {
            dsu.union(pair[0], pair[1]);
        }
        Map<Integer, List<Integer>> groups = new HashMap<>();
        for (int i = 0; i < n; i += 1) {
            int root = dsu.find(i);
            groups.computeIfAbsent(root, k -> new ArrayList<>()).add(i);
        }
        char[] result = s.toCharArray();
        for (List<Integer> indices : groups.values()) {
            List<Character> chars = new ArrayList<>();
            for (int idx : indices) {
                chars.add(result[idx]);
            }
            Collections.sort(indices);
            Collections.sort(chars);
            for (int i = 0; i < indices.size(); i += 1) {
                result[indices.get(i)] = chars.get(i);
            }
        }
        return new String(result);
    }
}
