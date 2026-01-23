class Subsets:
    def subsets(self, nums):
        if nums is None:
            return []

        nums = sorted(nums)
        results = []
        path = []

        def dfs(start):
            results.append(list(path))
            for i in range(start, len(nums)):
                path.append(nums[i])
                dfs(i + 1)
                path.pop()

        dfs(0)
        return results
