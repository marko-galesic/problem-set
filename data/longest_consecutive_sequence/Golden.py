class LongestConsecutiveSequence:
    def longestConsecutive(self, nums):
        if not nums:
            return 0
        s = set(nums)
        best = 0
        for n in s:
            if n - 1 not in s:
                length = 1
                cur = n + 1
                while cur in s:
                    length += 1
                    cur += 1
                if length > best:
                    best = length
        return best
