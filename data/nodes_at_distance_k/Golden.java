import java.util.*;

class NodesAtDistanceK {
    public int[] nodesAtDistanceK(int n, int[][] edges, int start, int k) {
        if (n <= 0 || start < 0 || start >= n) {
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
        Queue<Integer> queue = new ArrayDeque<>();
        queue.offer(start);
        dist[start] = 0;
        while (!queue.isEmpty()) {
            int u = queue.poll();
            for (int v : adj.get(u)) {
                if (dist[v] == -1) {
                    dist[v] = dist[u] + 1;
                    queue.offer(v);
                }
            }
        }
        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if (dist[i] == k) {
                result.add(i);
            }
        }
        int[] output = new int[result.size()];
        for (int i = 0; i < result.size(); i++) {
            output[i] = result.get(i);
        }
        return output;
    }
}
