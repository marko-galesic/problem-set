from collections import deque

class ShortestPathInBinaryMatrix:
    def shortestPathBinaryMatrix(self, grid):
        if not grid or not grid[0]:
            return -1
        rows = len(grid)
        cols = len(grid[0])
        if grid[0][0] != 0 or grid[rows - 1][cols - 1] != 0:
            return -1
        directions = [
            (-1, -1), (-1, 0), (-1, 1),
            (0, -1), (0, 1),
            (1, -1), (1, 0), (1, 1)
        ]
        visited = [[False] * cols for _ in range(rows)]
        queue = deque()
        queue.append((0, 0, 1))
        visited[0][0] = True
        while queue:
            r, c, dist = queue.popleft()
            if r == rows - 1 and c == cols - 1:
                return dist
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and not visited[nr][nc] and grid[nr][nc] == 0:
                    visited[nr][nc] = True
                    queue.append((nr, nc, dist + 1))
        return -1
