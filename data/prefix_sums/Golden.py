class PrefixSums:
    def prefixSums(self, nums):
        result = []
        total = 0
        for value in nums:
            total += value
            result.append(total)
        return result
