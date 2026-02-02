import java.util.ArrayDeque;
import java.util.Deque;

class MaximumWidthRamp {
    public int maxWidthRamp(int[] nums) {
        int n = nums.length;
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i < n; i += 1) {
            if (stack.isEmpty() || nums[i] < nums[stack.peek()]) {
                stack.push(i);
            }
        }
        int max = 0;
        for (int j = n - 1; j >= 0; j -= 1) {
            while (!stack.isEmpty() && nums[j] >= nums[stack.peek()]) {
                max = Math.max(max, j - stack.peek());
                stack.pop();
            }
        }
        return max;
    }
}
