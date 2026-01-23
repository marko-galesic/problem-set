class FirstIndexOfChar {
    public int firstIndexOfChar(String s, String c) {
        if (c.isEmpty()) return -1;
        return s.indexOf(c.charAt(0));
    }
}
