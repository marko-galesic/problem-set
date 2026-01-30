class MinStepsToZero {
    public int minStepsToZero(int n) {
        int steps = 0;
        while (n > 0) {
            if ((n & 1) == 0) {
                n /= 2;
            } else {
                n -= 1;
            }
            steps++;
        }
        return steps;
    }
}
