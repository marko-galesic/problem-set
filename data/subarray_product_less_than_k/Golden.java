class SubarrayProductLessThanK {
    public int numSubarrayProductLessThanK(int[] nums, int k) {
        if (nums == null || k <= 1) {
            return 0;
        }
        int product = 1;
        int left = 0;
        int count = 0;
        for (int right = 0; right < nums.length; right++) {
            product *= nums[right];
            while (product >= k && left <= right) {
                product /= nums[left++];
            }
            count += right - left + 1;
        }
        return count;
    }
}
