class FirstCharacter {
    public String firstCharacter(String s) {
        if (s.isEmpty()) {
            return "";
        }
        return String.valueOf(s.charAt(0));
    }
}
