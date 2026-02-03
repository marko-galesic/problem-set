from collections import deque


class MaxDistanceFromLand:
    def maxDistance(self, grid):
        if not grid:
            return -1
        rows = len(grid)
        cols = len(grid[0])
        queue = deque()
        land_count = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 1:
                    queue.append((r, c))
                    land_count += 1
        total = rows * cols
        if land_count == 0 or land_count == total:
            return -1
        visited = [[False] * cols for _ in range(rows)]
        for r, c in queue:
            visited[r][c] = True
        dist = -1
        dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        while queue:
            dist += 1
            for _ in range(len(queue)):
                r, c = queue.popleft()
                for dr, dc in dirs:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < rows and 0 <= nc < cols and not visited[nr][nc]:
                        visited[nr][nc] = True
                        queue.append((nr, nc))
        return dist
