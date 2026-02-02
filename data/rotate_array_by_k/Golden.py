class RotateArrayByK:
    def rotateArrayByK(self, nums, k):
        if not nums:
            return []
        k = k % len(nums)
        if k == 0:
            return nums[:]
        return nums[-k:] + nums[:-k]