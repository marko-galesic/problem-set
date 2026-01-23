class ClimbingStairs:
    def climbStairs(self, n):
        if n <= 0:
            return 0
        if n <= 2:
            return n
        prev2 = 1
        prev1 = 2
        for _ in range(3, n + 1):
            prev2, prev1 = prev1, prev1 + prev2
        return prev1
