from collections import Counter


class TopKFrequentElements:
    def topKFrequent(self, nums, k):
        freq = Counter(nums)
        return [num for num, _ in freq.most_common(k)]
