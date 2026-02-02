class LongestSubarraySumEqualsK:
    def longestSubarraySumEqualsK(self, nums, k):
        first = {0: -1}
        total = 0
        best = 0
        for i, n in enumerate(nums):
            total += n
            if total - k in first:
                best = max(best, i - first[total - k])
            if total not in first:
                first[total] = i
        return best