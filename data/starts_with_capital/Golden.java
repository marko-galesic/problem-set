class StartsWithCapital {
    public boolean startsWithCapital(String s) {
        if (s.isEmpty()) return false;
        char ch = s.charAt(0);
        return ch >= 'A' && ch <= 'Z';
    }
}
