class ContainsLowercase {
    public boolean containsLowercase(String s) {
        for (int i = 0; i < s.length(); i++) {
            if (Character.isLowerCase(s.charAt(i))) {
                return true;
            }
        }
        return false;
    }
}
