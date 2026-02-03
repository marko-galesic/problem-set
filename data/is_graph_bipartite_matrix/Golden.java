import java.util.*;

class IsGraphBipartiteMatrix {
    public boolean isBipartite(int[][] graph) {
        if (graph == null) {
            return true;
        }
        int n = graph.length;
        int[] color = new int[n];
        Arrays.fill(color, 0);
        for (int i = 0; i < n; i++) {
            if (color[i] != 0) {
                continue;
            }
            Queue<Integer> queue = new ArrayDeque<>();
            queue.offer(i);
            color[i] = 1;
            while (!queue.isEmpty()) {
                int u = queue.poll();
                for (int v : graph[u]) {
                    if (color[v] == 0) {
                        color[v] = -color[u];
                        queue.offer(v);
                    } else if (color[v] == color[u]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}
