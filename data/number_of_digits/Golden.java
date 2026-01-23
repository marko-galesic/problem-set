class NumberOfDigits {
    public int numberOfDigits(int n) {
        long value = Math.abs((long) n);
        if (value == 0) {
            return 1;
        }
        int count = 0;
        while (value > 0) {
            count++;
            value /= 10;
        }
        return count;
    }
}
