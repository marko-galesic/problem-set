class MinimumSwapsToGroupOnes:
    def minimumSwapsToGroupOnes(self, nums):
        ones = sum(nums)
        if ones <= 1:
            return 0
        zeros = sum(1 - n for n in nums[:ones])
        best = zeros
        for i in range(ones, len(nums)):
            zeros += (1 - nums[i]) - (1 - nums[i - ones])
            if zeros < best:
                best = zeros
        return best