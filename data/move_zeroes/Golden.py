class MoveZeroes:
    def moveZeroes(self, nums):
        if nums is None:
            return None

        result = [0] * len(nums)
        index = 0
        for num in nums:
            if num != 0:
                result[index] = num
                index += 1
        return result
