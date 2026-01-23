class LastCharacter {
    public String lastCharacter(String s) {
        if (s.isEmpty()) {
            return "";
        }
        return String.valueOf(s.charAt(s.length() - 1));
    }
}
