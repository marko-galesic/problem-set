class MaximumSumCircularSubarray:
    def maxSubarraySumCircular(self, nums):
        if not nums:
            return 0
        total = 0
        max_sum = nums[0]
        cur_max = 0
        min_sum = nums[0]
        cur_min = 0
        for n in nums:
            cur_max = max(cur_max + n, n)
            max_sum = max(max_sum, cur_max)
            cur_min = min(cur_min + n, n)
            min_sum = min(min_sum, cur_min)
            total += n
        if max_sum < 0:
            return max_sum
        return max(max_sum, total - min_sum)
