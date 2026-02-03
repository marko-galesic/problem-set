from collections import deque


class ShortestPathWithPortals:
    def shortestPathWithPortals(self, grid):
        if not grid:
            return -1
        rows = len(grid)
        cols = len(grid[0])
        sr = sc = -1
        tr = tc = -1
        portals = {}
        for r in range(rows):
            for c in range(cols):
                ch = grid[r][c]
                if ch == 'S':
                    sr, sc = r, c
                elif ch == 'E':
                    tr, tc = r, c
                elif 'a' <= ch <= 'z':
                    portals.setdefault(ch, []).append((r, c))
        if sr == -1 or tr == -1:
            return -1
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
                    nr, nc = r + dr, c + dc
                    if nr < 0 or nc < 0 or nr >= rows or nc >= cols:
                        continue
                    cell = grid[nr][nc]
                    if cell == '#':
                        continue
                    fr, fc = nr, nc
                    if 'a' <= cell <= 'z':
                        pair = portals.get(cell, [])
                        if len(pair) == 2:
                            if pair[0] == (nr, nc):
                                fr, fc = pair[1]
                            else:
                                fr, fc = pair[0]
                    if not visited[fr][fc]:
                        visited[fr][fc] = True
                        queue.append((fr, fc))
            steps += 1
        return -1
