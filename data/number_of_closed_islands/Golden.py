class NumberOfClosedIslands:
    def numberOfClosedIslands(self, grid):
        if not grid:
            return 0
        m = len(grid)
        n = len(grid[0])
        seen = [[False] * n for _ in range(m)]

        def dfs(i, j):
            if i < 0 or i >= m or j < 0 or j >= n:
                return False
            if grid[i][j] == 1 or seen[i][j]:
                return True
            seen[i][j] = True
            up = dfs(i - 1, j)
            down = dfs(i + 1, j)
            left = dfs(i, j - 1)
            right = dfs(i, j + 1)
            return up and down and left and right

        count = 0
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 0 and not seen[i][j]:
                    if dfs(i, j):
                        count += 1
        return count