class RemoveDuplicatesAllowTwo:
    def removeDuplicatesAllowTwo(self, nums):
        if not nums:
            return 0
        count = 1
        length = 1
        for i in range(1, len(nums)):
            if nums[i] == nums[i - 1]:
                count += 1
            else:
                count = 1
            if count <= 2:
                length += 1
        return length