from collections import deque


class RollingBallMazeShortestPath:
    def shortestDistance(self, maze, start, destination):
        if not maze:
            return -1
        rows = len(maze)
        cols = len(maze[0])
        sr, sc = start
        tr, tc = destination
        if (sr, sc) == (tr, tc):
            return 0
        visited = [[False] * cols for _ in range(rows)]
        queue = deque([(sr, sc)])
        visited[sr][sc] = True
        steps = 0
        dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        while queue:
            for _ in range(len(queue)):
                r, c = queue.popleft()
                if (r, c) == (tr, tc):
                    return steps
                for dr, dc in dirs:
                    nr, nc = r, c
                    while True:
                        rr, cc = nr + dr, nc + dc
                        if rr < 0 or cc < 0 or rr >= rows or cc >= cols or maze[rr][cc] == 1:
                            break
                        nr, nc = rr, cc
                    if not visited[nr][nc]:
                        visited[nr][nc] = True
                        queue.append((nr, nc))
            steps += 1
        return -1
