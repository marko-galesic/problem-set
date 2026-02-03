import java.util.*;

class MinCostClimbingStairs {
    public int minCostClimbingStairs(int[] cost) {
        if (cost == null || cost.length == 0) {
            return 0;
        }
        int prev2 = 0;
        int prev1 = 0;
        for (int i = 2; i <= cost.length; i++) {
            int one = prev1 + cost[i - 1];
            int two = prev2 + cost[i - 2];
            int cur = Math.min(one, two);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}
