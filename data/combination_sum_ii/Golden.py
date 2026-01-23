class CombinationSumII:
    def combinationSum2(self, candidates, target):
        if candidates is None or len(candidates) == 0:
            return []

        candidates.sort()
        results = []
        path = []

        def backtrack(start, remaining):
            if remaining == 0:
                results.append(path[:])
                return
            for i in range(start, len(candidates)):
                if i > start and candidates[i] == candidates[i - 1]:
                    continue
                value = candidates[i]
                if value > remaining:
                    break
                path.append(value)
                backtrack(i + 1, remaining - value)
                path.pop()

        backtrack(0, target)
        return results
