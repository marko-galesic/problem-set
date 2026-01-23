class CountEvenNumbers:
    def countEvenNumbers(self, nums):
        return sum(1 for value in nums if value % 2 == 0)
