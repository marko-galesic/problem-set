class CountOccurrencesOfChar {
    public int countOccurrencesOfChar(String s, String c) {
        if (c.isEmpty()) return 0;
        char target = c.charAt(0);
        int count = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == target) count++;
        }
        return count;
    }
}
