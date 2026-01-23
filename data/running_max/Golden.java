class RunningMax {
    public int[] runningMax(int[] nums) {
        if (nums.length == 0) return new int[0];
        int[] result = new int[nums.length];
        int current = nums[0];
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] > current) current = nums[i];
            result[i] = current;
        }
        return result;
    }
}
