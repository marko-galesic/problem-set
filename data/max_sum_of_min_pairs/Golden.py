class MaxSumOfMinPairs:
    def maxSumOfMinPairs(self, nums):
        nums.sort()
        return sum(nums[::2])