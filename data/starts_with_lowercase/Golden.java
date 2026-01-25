class StartsWithLowercase {
    public boolean startsWithLowercase(String s) {
        if (s.isEmpty()) {
            return false;
        }
        return Character.isLowerCase(s.charAt(0));
    }
}
