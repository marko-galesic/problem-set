class ContiguousArray:
    def findMaxLength(self, nums):
        first = {0: -1}
        best = 0
        running = 0
        for i, num in enumerate(nums):
            running += 1 if num == 1 else -1
            if running in first:
                best = max(best, i - first[running])
            else:
                first[running] = i
        return best
