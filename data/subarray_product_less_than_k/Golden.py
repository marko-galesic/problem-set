class SubarrayProductLessThanK:
    def numSubarrayProductLessThanK(self, nums, k):
        if k <= 1:
            return 0
        product = 1
        left = 0
        count = 0
        for right, num in enumerate(nums):
            product *= num
            while product >= k and left <= right:
                product //= nums[left]
                left += 1
            count += right - left + 1
        return count
