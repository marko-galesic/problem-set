class ClampToHundred {
    public int clampToHundred(int n) {
        if (n < -100) {
            return -100;
        }
        if (n > 100) {
            return 100;
        }
        return n;
    }
}
