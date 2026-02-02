class LongestSubarrayAtMostKDistinct:
    def longestSubarrayAtMostKDistinct(self, nums, k):
        if k <= 0:
            return 0
        left = 0
        counts = {}
        best = 0
        for right, n in enumerate(nums):
            counts[n] = counts.get(n, 0) + 1
            while len(counts) > k:
                val = nums[left]
                counts[val] -= 1
                if counts[val] == 0:
                    del counts[val]
                left += 1
            best = max(best, right - left + 1)
        return best