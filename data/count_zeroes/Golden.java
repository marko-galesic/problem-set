class CountZeroes {
    public int countZeroes(int[] nums) {
        int count = 0;
        for (int value : nums) {
            if (value == 0) count++;
        }
        return count;
    }
}
