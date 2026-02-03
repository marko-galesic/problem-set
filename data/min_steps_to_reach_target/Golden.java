import java.util.*;

class MinStepsToReachTarget {
    public int minStepsToReachTarget(int start, int target) {
        if (start == target) {
            return 0;
        }
        int max = Math.max(start, target) * 2 + 2;
        if (max < 2) {
            max = 2;
        }
        boolean[] visited = new boolean[max + 1];
        Queue<Integer> queue = new ArrayDeque<>();
        if (start < 0 || start > max) {
            return -1;
        }
        queue.offer(start);
        visited[start] = true;
        int steps = 0;
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                int cur = queue.poll();
                if (cur == target) {
                    return steps;
                }
                int[] nexts = new int[] { cur - 1, cur + 1, cur * 2 };
                for (int nxt : nexts) {
                    if (nxt < 0 || nxt > max) {
                        continue;
                    }
                    if (!visited[nxt]) {
                        visited[nxt] = true;
                        queue.offer(nxt);
                    }
                }
            }
            steps++;
        }
        return -1;
    }
}
