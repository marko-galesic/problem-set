class ReverseDigits {
    public int reverseDigits(int n) {
        int sign = n < 0 ? -1 : 1;
        int value = Math.abs(n);
        int reversed = 0;
        while (value > 0) {
            reversed = reversed * 10 + (value % 10);
            value /= 10;
        }
        return sign * reversed;
    }
}
