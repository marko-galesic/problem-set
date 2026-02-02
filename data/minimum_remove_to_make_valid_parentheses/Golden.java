import java.util.*;

class MinimumRemoveToMakeValidParentheses {
    public String minimumRemoveToMakeValidParentheses(String s) {
        if (s == null || s.isEmpty()) {
            return "";
        }
        Deque<Integer> stack = new ArrayDeque<>();
        boolean[] remove = new boolean[s.length()];
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            if (ch == '(') {
                stack.push(i);
            } else if (ch == ')') {
                if (stack.isEmpty()) {
                    remove[i] = true;
                } else {
                    stack.pop();
                }
            }
        }
        while (!stack.isEmpty()) {
            remove[stack.pop()] = true;
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            if (!remove[i]) {
                sb.append(s.charAt(i));
            }
        }
        return sb.toString();
    }
}