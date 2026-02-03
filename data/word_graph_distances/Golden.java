import java.util.*;

class WordGraphDistances {
    public int[] wordGraphDistances(String[] words, String start) {
        if (words == null) {
            return null;
        }
        int n = words.length;
        int startIndex = -1;
        for (int i = 0; i < n; i++) {
            if (words[i].equals(start)) {
                startIndex = i;
                break;
            }
        }
        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        if (startIndex == -1) {
            return dist;
        }
        Queue<Integer> queue = new ArrayDeque<>();
        queue.offer(startIndex);
        dist[startIndex] = 0;
        while (!queue.isEmpty()) {
            int idx = queue.poll();
            for (int j = 0; j < n; j++) {
                if (dist[j] != -1) {
                    continue;
                }
                if (isNeighbor(words[idx], words[j])) {
                    dist[j] = dist[idx] + 1;
                    queue.offer(j);
                }
            }
        }
        return dist;
    }

    private boolean isNeighbor(String a, String b) {
        if (a.length() != b.length()) {
            return false;
        }
        int diff = 0;
        for (int i = 0; i < a.length(); i++) {
            if (a.charAt(i) != b.charAt(i)) {
                diff++;
                if (diff > 1) {
                    return false;
                }
            }
        }
        return diff == 1;
    }
}
