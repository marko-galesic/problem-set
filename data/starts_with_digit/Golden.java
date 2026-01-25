class StartsWithDigit {
    public boolean startsWithDigit(String s) {
        if (s.isEmpty()) {
            return false;
        }
        return Character.isDigit(s.charAt(0));
    }
}
