class SingleNumber:
    def singleNumber(self, nums):
        if nums is None:
            return 0
        result = 0
        for num in nums:
            result ^= num
        return result
