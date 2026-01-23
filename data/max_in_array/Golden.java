class MaxInArray {
    public int maxInArray(int[] nums) {
        if (nums.length == 0) return 0;
        int max = nums[0];
        for (int value : nums) {
            if (value > max) max = value;
        }
        return max;
    }
}
