class MaxConsecutiveOnesWithKFlips:
    def maxConsecutiveOnesWithKFlips(self, nums, k):
        left = 0
        zeros = 0
        best = 0
        for right, n in enumerate(nums):
            if n == 0:
                zeros += 1
            while zeros > k:
                if nums[left] == 0:
                    zeros -= 1
                left += 1
            best = max(best, right - left + 1)
        return best