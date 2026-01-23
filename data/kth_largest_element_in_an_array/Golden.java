import java.util.Arrays;

class KthLargestElementInAnArray {
    public int findKthLargest(int[] nums, int k) {
        if (nums == null || nums.length == 0 || k <= 0 || k > nums.length) {
            return 0;
        }
        int[] copy = Arrays.copyOf(nums, nums.length);
        Arrays.sort(copy);
        return copy[copy.length - k];
    }
}
