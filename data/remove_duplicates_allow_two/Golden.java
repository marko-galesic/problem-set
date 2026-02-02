import java.util.*;

class RemoveDuplicatesAllowTwo {
    public int removeDuplicatesAllowTwo(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        int count = 1;
        int length = 1;
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] == nums[i - 1]) {
                count++;
            } else {
                count = 1;
            }
            if (count <= 2) {
                length++;
            }
        }
        return length;
    }
}