import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

class NextGreaterElementII {
    public int[] nextGreaterElements(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        Arrays.fill(result, -1);
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i < 2 * n; i += 1) {
            int idx = i % n;
            while (!stack.isEmpty() && nums[idx] > nums[stack.peek()]) {
                result[stack.pop()] = nums[idx];
            }
            if (i < n) {
                stack.push(idx);
            }
        }
        return result;
    }
}
