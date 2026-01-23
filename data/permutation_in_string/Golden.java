class PermutationInString {
    public boolean checkInclusion(String s1, String s2) {
        if (s1 == null || s2 == null) {
            return false;
        }
        int len1 = s1.length();
        int len2 = s2.length();
        if (len1 == 0) {
            return true;
        }
        if (len1 > len2) {
            return false;
        }

        int[] count1 = new int[26];
        int[] count2 = new int[26];

        for (int i = 0; i < len1; i++) {
            count1[s1.charAt(i) - 'a']++;
            count2[s2.charAt(i) - 'a']++;
        }

        if (arraysEqual(count1, count2)) {
            return true;
        }

        for (int right = len1; right < len2; right++) {
            count2[s2.charAt(right) - 'a']++;
            count2[s2.charAt(right - len1) - 'a']--;
            if (arraysEqual(count1, count2)) {
                return true;
            }
        }

        return false;
    }

    private boolean arraysEqual(int[] a, int[] b) {
        for (int i = 0; i < a.length; i++) {
            if (a[i] != b[i]) {
                return false;
            }
        }
        return true;
    }
}
