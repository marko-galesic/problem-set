class StartsWithVowel {
    public boolean startsWithVowel(String s) {
        if (s.isEmpty()) {
            return false;
        }
        char c = Character.toLowerCase(s.charAt(0));
        return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u';
    }
}
