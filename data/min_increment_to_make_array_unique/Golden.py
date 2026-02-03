class MinIncrementToMakeArrayUnique:
    def minIncrementForUnique(self, nums):
        if not nums:
            return 0
        nums = sorted(nums)
        moves = 0
        next_val = nums[0]
        for val in nums:
            if val < next_val:
                moves += next_val - val
            else:
                next_val = val
            next_val += 1
        return moves
