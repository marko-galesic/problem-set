class CombinationSumIII:
    def combinationSum3(self, k, n):
        result = []

        def backtrack(start, remain, path):
            if len(path) == k:
                if remain == 0:
                    result.append(path[:])
                return
            for num in range(start, 10):
                if num > remain:
                    break
                path.append(num)
                backtrack(num + 1, remain - num, path)
                path.pop()

        backtrack(1, n, [])
        return result
