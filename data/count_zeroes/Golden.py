class CountZeroes:
    def countZeroes(self, nums):
        return sum(1 for value in nums if value == 0)
