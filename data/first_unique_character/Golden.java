class FirstUniqueCharacter {
    public int firstUniqChar(String s) {
        if (s == null || s.length() == 0) {
            return -1;
        }

        int[] counts = new int[Character.MAX_VALUE + 1];
        for (int i = 0; i < s.length(); i++) {
            counts[s.charAt(i)]++;
        }

        for (int i = 0; i < s.length(); i++) {
            if (counts[s.charAt(i)] == 1) {
                return i;
            }
        }

        return -1;
    }
}
