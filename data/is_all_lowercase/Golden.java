class IsAllLowercase {
    public boolean isAllLowercase(String s) {
        boolean hasLetter = false;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (Character.isLetter(c)) {
                hasLetter = true;
                if (!Character.isLowerCase(c)) {
                    return false;
                }
            }
        }
        return hasLetter;
    }
}
