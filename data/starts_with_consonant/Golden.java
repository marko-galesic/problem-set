class StartsWithConsonant {
    public boolean startsWithConsonant(String s) {
        if (s.isEmpty()) {
            return false;
        }
        char c = s.charAt(0);
        if (!Character.isLetter(c)) {
            return false;
        }
        char lower = Character.toLowerCase(c);
        return lower != 'a' && lower != 'e' && lower != 'i' && lower != 'o' && lower != 'u';
    }
}
