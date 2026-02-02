class MaxAreaOfIsland:
    def maxAreaOfIsland(self, grid):
        if not grid:
            return 0
        m = len(grid)
        n = len(grid[0])
        seen = [[False] * n for _ in range(m)]

        def dfs(i, j):
            if i < 0 or i >= m or j < 0 or j >= n:
                return 0
            if seen[i][j] or grid[i][j] == 0:
                return 0
            seen[i][j] = True
            return 1 + dfs(i + 1, j) + dfs(i - 1, j) + dfs(i, j + 1) + dfs(i, j - 1)

        best = 0
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 1 and not seen[i][j]:
                    best = max(best, dfs(i, j))
        return best