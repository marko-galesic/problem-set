class LongestRunOfOnes {
    public int longestRunOfOnes(int n) {
        int maxRun = 0;
        int current = 0;
        while (n > 0) {
            if ((n & 1) == 1) {
                current++;
                if (current > maxRun) {
                    maxRun = current;
                }
            } else {
                current = 0;
            }
            n >>= 1;
        }
        return maxRun;
    }
}
