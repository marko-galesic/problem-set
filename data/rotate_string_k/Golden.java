class RotateStringK {
    public String rotateStringK(String s, int k) {
        if (s == null || s.length() == 0) {
            return s == null ? "" : s;
        }
        int n = s.length();
        int shift = k % n;
        if (shift == 0) {
            return s;
        }
        return s.substring(n - shift) + s.substring(0, n - shift);
    }
}
