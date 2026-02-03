import java.util.*;

class CountConnectedComponents {
    public int countComponents(int n, int[][] edges) {
        if (n <= 0) {
            return 0;
        }
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            adj.add(new ArrayList<>());
        }
        if (edges != null) {
            for (int[] e : edges) {
                if (e == null || e.length < 2) {
                    continue;
                }
                int u = e[0];
                int v = e[1];
                if (u < 0 || v < 0 || u >= n || v >= n) {
                    continue;
                }
                adj.get(u).add(v);
                adj.get(v).add(u);
            }
        }
        boolean[] visited = new boolean[n];
        int components = 0;
        for (int i = 0; i < n; i++) {
            if (visited[i]) {
                continue;
            }
            components++;
            Queue<Integer> queue = new ArrayDeque<>();
            queue.offer(i);
            visited[i] = true;
            while (!queue.isEmpty()) {
                int u = queue.poll();
                for (int v : adj.get(u)) {
                    if (!visited[v]) {
                        visited[v] = true;
                        queue.offer(v);
                    }
                }
            }
        }
        return components;
    }
}
