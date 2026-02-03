import java.util.*;

class RemoveKDigits {
    public String removeKdigits(String num, int k) {
        Deque<Character> stack = new ArrayDeque<>();
        int remaining = k;
        for (char c : num.toCharArray()) {
            while (remaining > 0 && !stack.isEmpty() && stack.peekLast() > c) {
                stack.pollLast();
                remaining--;
            }
            stack.addLast(c);
        }
        while (remaining > 0 && !stack.isEmpty()) {
            stack.pollLast();
            remaining--;
        }
        StringBuilder sb = new StringBuilder();
        boolean leadingZero = true;
        for (char c : stack) {
            if (leadingZero && c == '0') {
                continue;
            }
            leadingZero = false;
            sb.append(c);
        }
        if (sb.length() == 0) {
            return "0";
        }
        return sb.toString();
    }
}
