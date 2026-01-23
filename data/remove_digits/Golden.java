class RemoveDigits {
    public String removeDigits(String s) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (!Character.isDigit(c)) {
                sb.append(c);
            }
        }
        return sb.toString();
    }
}
