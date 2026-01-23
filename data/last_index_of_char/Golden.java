class LastIndexOfChar {
    public int lastIndexOfChar(String s, String c) {
        if (c.isEmpty()) return -1;
        return s.lastIndexOf(c.charAt(0));
    }
}
