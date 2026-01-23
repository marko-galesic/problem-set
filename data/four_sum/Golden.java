import java.util.*;

class FourSum {
    public int[][] fourSum(int[] nums, int target) {
        if (nums == null || nums.length < 4) {
            return new int[0][0];
        }

        Arrays.sort(nums);
        List<int[]> results = new ArrayList<>();
        int n = nums.length;

        for (int i = 0; i < n - 3; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }
            for (int j = i + 1; j < n - 2; j++) {
                if (j > i + 1 && nums[j] == nums[j - 1]) {
                    continue;
                }
                int left = j + 1;
                int right = n - 1;

                while (left < right) {
                    long sum = (long) nums[i] + nums[j] + nums[left] + nums[right];
                    if (sum == target) {
                        results.add(new int[] { nums[i], nums[j], nums[left], nums[right] });
                        left++;
                        right--;
                        while (left < right && nums[left] == nums[left - 1]) {
                            left++;
                        }
                        while (left < right && nums[right] == nums[right + 1]) {
                            right--;
                        }
                    } else if (sum < target) {
                        left++;
                    } else {
                        right--;
                    }
                }
            }
        }

        int[][] output = new int[results.size()][];
        for (int i = 0; i < results.size(); i++) {
            output[i] = results.get(i);
        }
        return output;
    }
}
