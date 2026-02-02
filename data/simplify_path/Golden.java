import java.util.*;

class SimplifyPath {
    public String simplifyPath(String path) {
        if (path == null || path.isEmpty()) {
            return "/";
        }
        Deque<String> stack = new ArrayDeque<>();
        String[] parts = path.split("/");
        for (String part : parts) {
            if (part.isEmpty() || part.equals(".")) {
                continue;
            }
            if (part.equals("..")) {
                if (!stack.isEmpty()) {
                    stack.removeLast();
                }
            } else {
                stack.addLast(part);
            }
        }
        StringBuilder sb = new StringBuilder();
        for (String part : stack) {
            sb.append('/').append(part);
        }
        return sb.length() == 0 ? "/" : sb.toString();
    }
}