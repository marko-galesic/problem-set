class CountEvenNumbers {
    public int countEvenNumbers(int[] nums) {
        int count = 0;
        for (int value : nums) {
            if (value % 2 == 0) count++;
        }
        return count;
    }
}
