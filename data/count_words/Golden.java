class CountWords {
    public int countWords(String s) {
        String trimmed = s.trim();
        if (trimmed.isEmpty()) return 0;
        return trimmed.split("\\s+").length;
    }
}
