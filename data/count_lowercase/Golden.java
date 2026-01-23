class CountLowercase {
    public int countLowercase(String s) {
        int count = 0;
        for (int i = 0; i < s.length(); i++) {
            if (Character.isLowerCase(s.charAt(i))) {
                count++;
            }
        }
        return count;
    }
}
