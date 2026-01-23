class LongestWordLength {
    public int longestWordLength(String[] words) {
        int maxLen = 0;
        for (String word : words) {
            if (word.length() > maxLen) maxLen = word.length();
        }
        return maxLen;
    }
}
