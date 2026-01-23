class MaximumAverageSubarrayI:
    def findMaxAverage(self, nums, k):
        if not nums or k <= 0:
            return 0.0
        window_sum = sum(nums[:k])
        max_sum = window_sum
        for i in range(k, len(nums)):
            window_sum += nums[i] - nums[i - k]
            if window_sum > max_sum:
                max_sum = window_sum
        return max_sum / k
