class DecodeWays {
    public int numDecodings(String s) {
        if (s == null || s.isEmpty()) {
            return 0;
        }
        int prev2 = 1;
        int prev1 = s.charAt(0) != '0' ? 1 : 0;
        for (int i = 1; i < s.length(); i++) {
            int current = 0;
            char c = s.charAt(i);
            if (c != '0') {
                current += prev1;
            }
            int two = (s.charAt(i - 1) - '0') * 10 + (s.charAt(i) - '0');
            if (two >= 10 && two <= 26) {
                current += prev2;
            }
            prev2 = prev1;
            prev1 = current;
        }
        return prev1;
    }
}
