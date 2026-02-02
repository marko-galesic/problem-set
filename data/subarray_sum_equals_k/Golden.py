class SubarraySumEqualsK:
    def subarraySum(self, nums, k):
        counts = {0: 1}
        total = 0
        running = 0
        for num in nums:
            running += num
            total += counts.get(running - k, 0)
            counts[running] = counts.get(running, 0) + 1
        return total
