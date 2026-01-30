class SumOfDigitSquares {
    public int sumOfDigitSquares(int n) {
        int value = Math.abs(n);
        int sum = 0;
        while (value > 0) {
            int digit = value % 10;
            sum += digit * digit;
            value /= 10;
        }
        return sum;
    }
}
