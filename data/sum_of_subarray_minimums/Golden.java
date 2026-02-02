import java.util.ArrayDeque;
import java.util.Deque;

class SumOfSubarrayMinimums {
    public int sumSubarrayMins(int[] arr) {
        int n = arr.length;
        int[] left = new int[n];
        int[] right = new int[n];
        Deque<Integer> stack = new ArrayDeque<>();

        for (int i = 0; i < n; i += 1) {
            while (!stack.isEmpty() && arr[stack.peek()] > arr[i]) {
                stack.pop();
            }
            left[i] = stack.isEmpty() ? i + 1 : i - stack.peek();
            stack.push(i);
        }

        stack.clear();
        for (int i = n - 1; i >= 0; i -= 1) {
            while (!stack.isEmpty() && arr[stack.peek()] >= arr[i]) {
                stack.pop();
            }
            right[i] = stack.isEmpty() ? n - i : stack.peek() - i;
            stack.push(i);
        }

        long mod = 1_000_000_007L;
        long sum = 0;
        for (int i = 0; i < n; i += 1) {
            long contribution = (long) arr[i] * left[i] * right[i];
            sum = (sum + contribution) % mod;
        }
        return (int) sum;
    }
}
