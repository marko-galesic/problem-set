import java.util.*;

class OpenTheLock {
    public int openLock(String[] deadends, String target) {
        Set<String> dead = new HashSet<>();
        if (deadends != null) {
            dead.addAll(Arrays.asList(deadends));
        }
        String start = "0000";
        if (dead.contains(start)) {
            return -1;
        }
        if (start.equals(target)) {
            return 0;
        }
        Queue<String> queue = new ArrayDeque<>();
        queue.offer(start);
        Set<String> seen = new HashSet<>();
        seen.add(start);
        int steps = 0;
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                String cur = queue.poll();
                if (cur.equals(target)) {
                    return steps;
                }
                for (int pos = 0; pos < 4; pos++) {
                    char[] chars = cur.toCharArray();
                    int digit = chars[pos] - '0';
                    int up = (digit + 1) % 10;
                    int down = (digit + 9) % 10;
                    chars[pos] = (char) ('0' + up);
                    String next = new String(chars);
                    if (!dead.contains(next) && seen.add(next)) {
                        queue.offer(next);
                    }
                    chars[pos] = (char) ('0' + down);
                    next = new String(chars);
                    if (!dead.contains(next) && seen.add(next)) {
                        queue.offer(next);
                    }
                }
            }
            steps++;
        }
        return -1;
    }
}
