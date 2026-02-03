class MinCostClimbingStairs:
    def minCostClimbingStairs(self, cost):
        if not cost:
            return 0
        prev2 = 0
        prev1 = 0
        for i in range(2, len(cost) + 1):
            one = prev1 + cost[i - 1]
            two = prev2 + cost[i - 2]
            cur = min(one, two)
            prev2, prev1 = prev1, cur
        return prev1
