class MaximumSubarray:
    def maxSubArray(self, nums):
        if not nums:
            return 0
        current = nums[0]
        best = nums[0]
        for value in nums[1:]:
            current = max(value, current + value)
            if current > best:
                best = current
        return best
