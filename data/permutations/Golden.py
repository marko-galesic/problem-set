class Permutations:
    def permute(self, nums):
        if nums is None or len(nums) == 0:
            return []

        values = sorted(nums)
        results = []
        used = [False] * len(values)
        path = [0] * len(values)

        def backtrack(depth):
            if depth == len(values):
                results.append(path[:])
                return
            for i in range(len(values)):
                if used[i]:
                    continue
                used[i] = True
                path[depth] = values[i]
                backtrack(depth + 1)
                used[i] = False

        backtrack(0)
        return results
