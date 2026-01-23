class SwapFirstLastChar {
    public String swapFirstLastChar(String s) {
        if (s.length() <= 1) return s;
        return s.charAt(s.length() - 1) + s.substring(1, s.length() - 1) + s.charAt(0);
    }
}
