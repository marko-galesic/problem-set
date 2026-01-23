import java.util.*;

class ValidParentheses {
    public boolean isValid(String s) {
        if (s == null || s.length() == 0) {
            return true;
        }
        
        // Odd length strings cannot be valid
        if (s.length() % 2 != 0) {
            return false;
        }
        
        Stack<Character> stack = new Stack<>();
        
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                // Push opening brackets onto stack
                stack.push(c);
            } else {
                // If stack is empty, we have a closing bracket without an opening one
                if (stack.isEmpty()) {
                    return false;
                }
                
                // Check if the closing bracket matches the most recent opening bracket
                char top = stack.pop();
                if ((c == ')' && top != '(') ||
                    (c == ']' && top != '[') ||
                    (c == '}' && top != '{')) {
                    return false;
                }
            }
        }
        
        // Stack should be empty if all brackets are matched
        return stack.isEmpty();
    }
}
