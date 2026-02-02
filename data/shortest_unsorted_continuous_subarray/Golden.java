import java.util.ArrayDeque;
import java.util.Deque;

class ShortestUnsortedContinuousSubarray {
    public int findUnsortedSubarray(int[] nums) {
        int n = nums.length;
        int left = n;
        int right = 0;
        Deque<Integer> stack = new ArrayDeque<>();

        for (int i = 0; i < n; i += 1) {
            while (!stack.isEmpty() && nums[stack.peek()] > nums[i]) {
                left = Math.min(left, stack.pop());
            }
            stack.push(i);
        }

        stack.clear();
        for (int i = n - 1; i >= 0; i -= 1) {
            while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
                right = Math.max(right, stack.pop());
            }
            stack.push(i);
        }

        if (right <= left) {
            return 0;
        }
        return right - left + 1;
    }
}
