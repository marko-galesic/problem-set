class RotateLeftByOne:
    def rotateLeftByOne(self, nums):
        if len(nums) <= 1:
            return list(nums)
        return nums[1:] + [nums[0]]
