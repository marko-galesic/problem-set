import java.util.ArrayList;
import java.util.List;

class GenerateParentheses {
    public String[] generateParenthesis(int n) {
        List<String> result = new ArrayList<>();
        backtrack(result, new StringBuilder(), 0, 0, n);
        return result.toArray(new String[0]);
    }

    private void backtrack(List<String> result, StringBuilder current, int openCount, int closeCount, int maxPairs) {
        if (current.length() == maxPairs * 2) {
            result.add(current.toString());
            return;
        }

        if (openCount < maxPairs) {
            current.append('(');
            backtrack(result, current, openCount + 1, closeCount, maxPairs);
            current.deleteCharAt(current.length() - 1);
        }

        if (closeCount < openCount) {
            current.append(')');
            backtrack(result, current, openCount, closeCount + 1, maxPairs);
            current.deleteCharAt(current.length() - 1);
        }
    }
}
