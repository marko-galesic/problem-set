from collections import deque


class NearestExitInMaze:
    def nearestExit(self, maze, entrance):
        if not maze:
            return -1
        rows = len(maze)
        cols = len(maze[0])
        sr, sc = entrance
        visited = [[False] * cols for _ in range(rows)]
        queue = deque([(sr, sc)])
        visited[sr][sc] = True
        steps = 0
        dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        while queue:
            for _ in range(len(queue)):
                r, c = queue.popleft()
                if (r, c) != (sr, sc) and (r == 0 or c == 0 or r == rows - 1 or c == cols - 1):
                    return steps
                for dr, dc in dirs:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < rows and 0 <= nc < cols and not visited[nr][nc] and maze[nr][nc] != '+':
                        visited[nr][nc] = True
                        queue.append((nr, nc))
            steps += 1
        return -1
