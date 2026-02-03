from collections import deque


class ShortestPathToFood:
    def shortestPathToFood(self, grid):
        if not grid:
            return -1
        rows = len(grid)
        cols = len(grid[0])
        sr = sc = -1
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == '*':
                    sr, sc = r, c
        if sr == -1:
            return -1
        queue = deque([(sr, sc)])
        visited = [[False] * cols for _ in range(rows)]
        visited[sr][sc] = True
        steps = 0
        dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        while queue:
            for _ in range(len(queue)):
                r, c = queue.popleft()
                if grid[r][c] == '#':
                    return steps
                for dr, dc in dirs:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < rows and 0 <= nc < cols and not visited[nr][nc] and grid[nr][nc] != 'X':
                        if grid[nr][nc] == '#':
                            return steps + 1
                        visited[nr][nc] = True
                        queue.append((nr, nc))
            steps += 1
        return -1
