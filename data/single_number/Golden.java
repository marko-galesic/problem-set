class SingleNumber {
    public int singleNumber(int[] nums) {
        if (nums == null) {
            return 0;
        }
        int result = 0;
        for (int num : nums) {
            result ^= num;
        }
        return result;
    }
}
