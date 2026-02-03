import java.util.*;

class GraphDistancesFromSource {
    public int[] distancesFromSource(int n, int[][] edges, int source) {
        if (n <= 0) {
            return new int[0];
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
        if (source < 0 || source >= n) {
            return dist;
        }
        Queue<Integer> queue = new ArrayDeque<>();
        queue.offer(source);
        dist[source] = 0;
        while (!queue.isEmpty()) {
            int u = queue.poll();
            for (int v : adj.get(u)) {
                if (dist[v] == -1) {
                    dist[v] = dist[u] + 1;
                    queue.offer(v);
                }
            }
        }
        return dist;
    }
}
