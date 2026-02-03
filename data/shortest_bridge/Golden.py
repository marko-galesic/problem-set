from collections import deque


class ShortestBridge:
    def shortestBridge(self, grid):
        rows = len(grid)
        cols = len(grid[0]) if rows else 0
        visited = [[False] * cols for _ in range(rows)]
        q = deque()

        def dfs(r, c):
            if r < 0 or r >= rows or c < 0 or c >= cols:
                return
            if visited[r][c] or grid[r][c] == 0:
                return
            visited[r][c] = True
            q.append((r, c))
            dfs(r + 1, c)
            dfs(r - 1, c)
            dfs(r, c + 1)
            dfs(r, c - 1)

        found = False
        for r in range(rows):
            if found:
                break
            for c in range(cols):
                if grid[r][c] == 1:
                    dfs(r, c)
                    found = True
                    break

        steps = 0
        while q:
            for _ in range(len(q)):
                r, c = q.popleft()
                for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)]:
                    nr, nc = r + dr, c + dc
                    if nr < 0 or nr >= rows or nc < 0 or nc >= cols:
                        continue
                    if visited[nr][nc]:
                        continue
                    if grid[nr][nc] == 1:
                        return steps
                    visited[nr][nc] = True
                    q.append((nr, nc))
            steps += 1
        return -1
