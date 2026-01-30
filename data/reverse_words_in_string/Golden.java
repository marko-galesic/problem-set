class ReverseWordsInString {
    public String reverseWordsInString(String s) {
        if (s == null || s.length() == 0) {
            return s == null ? "" : s;
        }
        String[] parts = s.split(" ");
        StringBuilder sb = new StringBuilder();
        for (int i = parts.length - 1; i >= 0; i--) {
            sb.append(parts[i]);
            if (i != 0) {
                sb.append(" ");
            }
        }
        return sb.toString();
    }
}
