import java.util.*;

class LetterCombinationsOfAPhoneNumber {
    public String[] letterCombinations(String digits) {
        if (digits == null || digits.length() == 0) {
            return new String[0];
        }

        String[] mapping = new String[] {
            "", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"
        };

        List<String> results = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        backtrack(digits, 0, mapping, current, results);
        return results.toArray(new String[0]);
    }

    private void backtrack(String digits, int index, String[] mapping, StringBuilder current, List<String> results) {
        if (index == digits.length()) {
            results.add(current.toString());
            return;
        }

        char digit = digits.charAt(index);
        if (digit < '0' || digit > '9') {
            return;
        }
        String letters = mapping[digit - '0'];
        if (letters.isEmpty()) {
            return;
        }

        for (int i = 0; i < letters.length(); i++) {
            current.append(letters.charAt(i));
            backtrack(digits, index + 1, mapping, current, results);
            current.deleteCharAt(current.length() - 1);
        }
    }
}
