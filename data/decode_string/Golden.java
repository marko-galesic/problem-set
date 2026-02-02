import java.util.*;

class DecodeString {
    public String decodeString(String s) {
        if (s == null) {
            return "";
        }
        ArrayDeque<Integer> counts = new ArrayDeque<>();
        ArrayDeque<StringBuilder> builders = new ArrayDeque<>();
        StringBuilder current = new StringBuilder();
        int number = 0;
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            if (Character.isDigit(ch)) {
                number = number * 10 + (ch - '0');
            } else if (ch == '[') {
                counts.push(number);
                builders.push(current);
                current = new StringBuilder();
                number = 0;
            } else if (ch == ']') {
                int repeat = counts.pop();
                StringBuilder prev = builders.pop();
                for (int r = 0; r < repeat; r++) {
                    prev.append(current);
                }
                current = prev;
            } else {
                current.append(ch);
            }
        }
        return current.toString();
    }
}
