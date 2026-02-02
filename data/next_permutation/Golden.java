import java.util.*;

class NextPermutation {
    public int[] nextPermutation(int[] nums) {
        if (nums == null || nums.length == 0) {
            return new int[0];
        }
        int[] arr = Arrays.copyOf(nums, nums.length);
        int i = arr.length - 2;
        while (i >= 0 && arr[i] >= arr[i + 1]) {
            i--;
        }
        if (i >= 0) {
            int j = arr.length - 1;
            while (arr[j] <= arr[i]) {
                j--;
            }
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        reverse(arr, i + 1, arr.length - 1);
        return arr;
    }

    private void reverse(int[] arr, int left, int right) {
        while (left < right) {
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
    }
}
