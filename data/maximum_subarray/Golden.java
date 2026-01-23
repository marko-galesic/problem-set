class MaximumSubarray {
    public int maxSubArray(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        int current = nums[0];
        int best = nums[0];
        for (int i = 1; i < nums.length; i++) {
            int value = nums[i];
            current = Math.max(value, current + value);
            if (current > best) {
                best = current;
            }
        }
        return best;
    }
}
