import java.util.*;

class CoinChange {
    public int coinChange(int[] coins, int amount) {
        if (amount == 0) {
            return 0;
        }
        
        // dp[i] represents the minimum number of coins needed to make amount i
        int[] dp = new int[amount + 1];
        
        // Initialize with a large value (impossible)
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0; // Base case: 0 coins needed for amount 0
        
        // For each amount from 1 to amount
        for (int i = 1; i <= amount; i++) {
            // Try each coin denomination
            for (int coin : coins) {
                // If we can use this coin (coin <= i) and we have a valid solution for (i - coin)
                if (coin <= i && dp[i - coin] != Integer.MAX_VALUE) {
                    // Update dp[i] to be the minimum of current value and 1 + dp[i - coin]
                    dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
                }
            }
        }
        
        // If dp[amount] is still Integer.MAX_VALUE, it means we couldn't make the amount
        return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];
    }
}
