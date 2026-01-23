class SearchInRotatedSortedArray {
    public int search(int[] nums, int target) {
        if (nums == null || nums.length == 0) {
            return -1;
        }
        int left = 0;
        int right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            int value = nums[mid];
            if (value == target) {
                return mid;
            }
            if (nums[left] <= value) {
                if (nums[left] <= target && target < value) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            } else {
                if (value < target && target <= nums[right]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }
        return -1;
    }
}
