import java.util.*;

class JumpGameIvMinJumps {
    public int minJumps(int[] arr) {
        if (arr == null || arr.length <= 1) {
            return 0;
        }
        int n = arr.length;
        Map<Integer, List<Integer>> map = new HashMap<>();
        for (int i = 0; i < n; i++) {
            map.computeIfAbsent(arr[i], k -> new ArrayList<>()).add(i);
        }
        Queue<Integer> queue = new ArrayDeque<>();
        boolean[] visited = new boolean[n];
        queue.offer(0);
        visited[0] = true;
        int steps = 0;
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                int idx = queue.poll();
                if (idx == n - 1) {
                    return steps;
                }
                List<Integer> same = map.get(arr[idx]);
                if (same != null) {
                    for (int next : same) {
                        if (!visited[next]) {
                            visited[next] = true;
                            queue.offer(next);
                        }
                    }
                    same.clear();
                }
                int left = idx - 1;
                int right = idx + 1;
                if (left >= 0 && !visited[left]) {
                    visited[left] = true;
                    queue.offer(left);
                }
                if (right < n && !visited[right]) {
                    visited[right] = true;
                    queue.offer(right);
                }
            }
            steps++;
        }
        return -1;
    }
}
