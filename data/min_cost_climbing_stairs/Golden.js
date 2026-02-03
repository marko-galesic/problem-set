class MinCostClimbingStairs {
  minCostClimbingStairs(cost) {
    if (!cost || cost.length === 0) {
      return 0;
    }
    let prev2 = 0;
    let prev1 = 0;
    for (let i = 2; i <= cost.length; i++) {
      const one = prev1 + cost[i - 1];
      const two = prev2 + cost[i - 2];
      const cur = Math.min(one, two);
      prev2 = prev1;
      prev1 = cur;
    }
    return prev1;
  }
}
