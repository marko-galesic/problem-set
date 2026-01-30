class HouseRobber:
    def rob(self, nums):
        prev2 = 0
        prev1 = 0
        for n in nums:
            cur = max(prev1, prev2 + n)
            prev2 = prev1
            prev1 = cur
        return prev1
