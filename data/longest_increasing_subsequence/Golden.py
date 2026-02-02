import bisect

class LongestIncreasingSubsequence:
    def lengthOfLIS(self, nums):
        tails = []
        for num in nums:
            i = bisect.bisect_left(tails, num)
            if i == len(tails):
                tails.append(num)
            else:
                tails[i] = num
        return len(tails)
