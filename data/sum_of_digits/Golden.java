class SumOfDigits {
    public int sumOfDigits(int n) {
        long value = Math.abs((long) n);
        int sum = 0;
        while (value > 0) {
            sum += (int) (value % 10);
            value /= 10;
        }
        return sum;
    }
}
