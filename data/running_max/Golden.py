class RunningMax:
    def runningMax(self, nums):
        if not nums:
            return []
        result = []
        current = nums[0]
        for value in nums:
            if value > current:
                current = value
            result.append(current)
        return result
