class RotateLeftByOne {
    public int[] rotateLeftByOne(int[] nums) {
        if (nums.length <= 1) return nums;
        int[] result = new int[nums.length];
        for (int i = 0; i < nums.length - 1; i++) {
            result[i] = nums[i + 1];
        }
        result[nums.length - 1] = nums[0];
        return result;
    }
}
