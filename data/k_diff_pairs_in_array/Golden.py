from collections import Counter


class KDiffPairsInArray:
    def findPairs(self, nums, k):
        if k < 0:
            return 0
        freq = Counter(nums)
        if k == 0:
            return sum(1 for v in freq.values() if v > 1)
        count = 0
        for n in freq:
            if n + k in freq:
                count += 1
        return count
