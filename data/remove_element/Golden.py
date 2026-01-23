class RemoveElement:
    def removeElement(self, nums, val):
        if nums is None or len(nums) == 0:
            return 0
        write = 0
        for i in range(len(nums)):
            if nums[i] != val:
                nums[write] = nums[i]
                write += 1
        return write
