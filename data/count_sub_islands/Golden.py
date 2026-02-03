class CountSubIslands:
    def countSubIslands(self, grid1, grid2):
        rows = len(grid2)
        cols = len(grid2[0]) if rows else 0
        visited = [[False] * cols for _ in range(rows)]

        def dfs(r, c):
            if r < 0 or r >= rows or c < 0 or c >= cols:
                return True
            if grid2[r][c] == 0 or visited[r][c]:
                return True
            visited[r][c] = True
            is_sub = grid1[r][c] == 1
            if not dfs(r + 1, c):
                is_sub = False
            if not dfs(r - 1, c):
                is_sub = False
            if not dfs(r, c + 1):
                is_sub = False
            if not dfs(r, c - 1):
                is_sub = False
            return is_sub

        count = 0
        for r in range(rows):
            for c in range(cols):
                if grid2[r][c] == 1 and not visited[r][c]:
                    if dfs(r, c):
                        count += 1
        return count
