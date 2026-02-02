import java.util.*;

class CountSubarraysWithEvenSum {
    public int countSubarraysWithEvenSum(int[] nums) {
        if (nums == null) {
            return 0;
        }
        int even = 1;
        int odd = 0;
        int total = 0;
        int running = 0;
        for (int n : nums) {
            running += n;
            if (running % 2 == 0) {
                total += even;
                even++;
            } else {
                total += odd;
                odd++;
            }
        }
        return total;
    }
}