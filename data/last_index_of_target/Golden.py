class LastIndexOfTarget:
    def lastIndexOfTarget(self, nums, target):
        for i in range(len(nums) - 1, -1, -1):
            if nums[i] == target:
                return i
        return -1
