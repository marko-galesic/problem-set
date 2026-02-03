import java.util.*;

class ShortestPathUnweightedGraph {
    public int shortestPath(int n, int[][] edges, int start, int end) {
        if (n <= 0) {
            return -1;
        }
        if (start == end) {
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
        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        Queue<Integer> queue = new ArrayDeque<>();
        queue.offer(start);
        dist[start] = 0;
        while (!queue.isEmpty()) {
            int u = queue.poll();
            if (u == end) {
                return dist[u];
            }
            for (int v : adj.get(u)) {
                if (dist[v] == -1) {
                    dist[v] = dist[u] + 1;
                    queue.offer(v);
                }
            }
        }
        return -1;
    }
}
