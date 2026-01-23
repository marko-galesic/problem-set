class DigitalRoot {
    public int digitalRoot(int n) {
        int value = Math.abs(n);
        while (value >= 10) {
            int sum = 0;
            while (value > 0) {
                sum += value % 10;
                value /= 10;
            }
            value = sum;
        }
        return value;
    }
}
