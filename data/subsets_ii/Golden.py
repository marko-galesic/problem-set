class SubsetsII:
    def subsetsWithDup(self, nums):
        if nums is None:
            return []
        nums = sorted(nums)
        result = []
        path = []

        def backtrack(start):
            result.append(list(path))
            for i in range(start, len(nums)):
                if i > start and nums[i] == nums[i - 1]:
                    continue
                path.append(nums[i])
                backtrack(i + 1)
                path.pop()

        backtrack(0)
        return result
