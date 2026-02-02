class SubarraySumDivisibleByK:
    def subarraySumDivisibleByK(self, nums, k):
        counts = {0: 1}
        total = 0
        result = 0
        for n in nums:
            total = (total + n) % k
            result += counts.get(total, 0)
            counts[total] = counts.get(total, 0) + 1
        return result