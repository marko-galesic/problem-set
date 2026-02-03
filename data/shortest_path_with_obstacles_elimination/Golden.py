from collections import deque


class ShortestPathWithObstaclesElimination:
    def shortestPath(self, grid, k):
        if not grid:
            return -1
        rows = len(grid)
        cols = len(grid[0])
        start_remaining = k - grid[0][0]
        if start_remaining < 0:
            return -1
        if rows == 1 and cols == 1:
            return 0
        best = [[-1] * cols for _ in range(rows)]
        best[0][0] = start_remaining
        queue = deque([(0, 0, start_remaining)])
        steps = 0
        dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        while queue:
            for _ in range(len(queue)):
                r, c, remaining = queue.popleft()
                if r == rows - 1 and c == cols - 1:
                    return steps
                for dr, dc in dirs:
                    nr, nc = r + dr, c + dc
                    if nr < 0 or nc < 0 or nr >= rows or nc >= cols:
                        continue
                    next_remaining = remaining - grid[nr][nc]
                    if next_remaining < 0:
                        continue
                    if best[nr][nc] >= next_remaining:
                        continue
                    best[nr][nc] = next_remaining
                    queue.append((nr, nc, next_remaining))
            steps += 1
        return -1
