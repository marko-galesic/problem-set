class MinInArray {
    public int minInArray(int[] nums) {
        if (nums.length == 0) return 0;
        int min = nums[0];
        for (int value : nums) {
            if (value < min) min = value;
        }
        return min;
    }
}
