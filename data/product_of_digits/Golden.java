class ProductOfDigits {
    public int productOfDigits(int n) {
        long value = Math.abs((long) n);
        if (value == 0) {
            return 0;
        }
        int product = 1;
        while (value > 0) {
            product *= (int) (value % 10);
            value /= 10;
        }
        return product;
    }
}
