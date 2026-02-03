import java.util.*;

class JumpGameIiiMinSteps {
    public int minStepsToReachZero(int[] arr, int start) {
        if (arr == null || start < 0 || start >= arr.length) {
            return -1;
        }
        if (arr[start] == 0) {
            return 0;
        }
        int n = arr.length;
        boolean[] visited = new boolean[n];
        Queue<Integer> queue = new ArrayDeque<>();
        queue.offer(start);
        visited[start] = true;
        int steps = 0;
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                int idx = queue.poll();
                if (arr[idx] == 0) {
                    return steps;
                }
                int left = idx - arr[idx];
                int right = idx + arr[idx];
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
