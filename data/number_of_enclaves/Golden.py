from collections import deque


class NumberOfEnclaves:
    def numEnclaves(self, grid):
        rows = len(grid)
        cols = len(grid[0]) if rows else 0
        visited = [[False] * cols for _ in range(rows)]
        q = deque()

        for r in range(rows):
            if grid[r][0] == 1:
                visited[r][0] = True
                q.append((r, 0))
            if cols > 1 and grid[r][cols - 1] == 1 and not visited[r][cols - 1]:
                visited[r][cols - 1] = True
                q.append((r, cols - 1))
        for c in range(cols):
            if grid[0][c] == 1 and not visited[0][c]:
                visited[0][c] = True
                q.append((0, c))
            if rows > 1 and grid[rows - 1][c] == 1 and not visited[rows - 1][c]:
                visited[rows - 1][c] = True
                q.append((rows - 1, c))

        dirs = [(1,0), (-1,0), (0,1), (0,-1)]
        while q:
            r, c = q.popleft()
            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1 and not visited[nr][nc]:
                    visited[nr][nc] = True
                    q.append((nr, nc))

        count = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 1 and not visited[r][c]:
                    count += 1
        return count
