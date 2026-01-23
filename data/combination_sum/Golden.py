class CombinationSum:
    def combinationSum(self, candidates, target):
        if candidates is None or len(candidates) == 0 or target <= 0:
            return []

        candidates.sort()
        results = []
        path = []

        def backtrack(start, remaining):
            if remaining == 0:
                results.append(path[:])
                return

            for i in range(start, len(candidates)):
                value = candidates[i]
                if value > remaining:
                    break
                if i > start and candidates[i] == candidates[i - 1]:
                    continue
                path.append(value)
                backtrack(i, remaining - value)
                path.pop()

        backtrack(0, target)
        return results
