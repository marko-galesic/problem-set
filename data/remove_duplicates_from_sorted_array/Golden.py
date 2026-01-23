class RemoveDuplicatesFromSortedArray:
    def removeDuplicates(self, nums):
        if nums is None or len(nums) == 0:
            return 0
        write = 1
        for i in range(1, len(nums)):
            if nums[i] != nums[write - 1]:
                nums[write] = nums[i]
                write += 1
        return write
