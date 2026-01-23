class CountGreaterThan:
    def countGreaterThan(self, nums, threshold):
        return sum(1 for value in nums if value > threshold)
