class FindDuplicateNumber {
    public int findDuplicate(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        int slow = nums[0];
        int fast = nums[0];
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);
        int finder = nums[0];
        while (finder != slow) {
            finder = nums[finder];
            slow = nums[slow];
        }
        return finder;
    }
}
