import java.util.*;

class SmallestSubsequenceOfDistinctChars {
    public String smallestSubsequence(String s) {
        int[] last = new int[256];
        for (int i = 0; i < s.length(); i++) {
            last[s.charAt(i)] = i;
        }
        boolean[] used = new boolean[256];
        Deque<Character> stack = new ArrayDeque<>();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (used[c]) {
                continue;
            }
            while (!stack.isEmpty() && c < stack.peekLast() && last[stack.peekLast()] > i) {
                used[stack.pollLast()] = false;
            }
            stack.addLast(c);
            used[c] = true;
        }
        StringBuilder sb = new StringBuilder();
        for (char c : stack) {
            sb.append(c);
        }
        return sb.toString();
    }
}
