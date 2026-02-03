from collections import deque


class ShortestPathCollectAllKeys:
    def shortestPathAllKeys(self, grid):
        if not grid:
            return -1
        rows = len(grid)
        cols = len(grid[0])
        sr = sc = 0
        target_mask = 0
        for r in range(rows):
            for c in range(cols):
                ch = grid[r][c]
                if ch == '@':
                    sr, sc = r, c
                elif 'a' <= ch <= 'f':
                    target_mask |= 1 << (ord(ch) - ord('a'))
        if target_mask == 0:
            return 0
        visited = [[[False] * (1 << 6) for _ in range(cols)] for _ in range(rows)]
        queue = deque([(sr, sc, 0)])
        visited[sr][sc][0] = True
        steps = 0
        dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        while queue:
            for _ in range(len(queue)):
                r, c, mask = queue.popleft()
                if mask == target_mask:
                    return steps
                for dr, dc in dirs:
                    nr, nc = r + dr, c + dc
                    if nr < 0 or nc < 0 or nr >= rows or nc >= cols:
                        continue
                    cell = grid[nr][nc]
                    if cell == '#':
                        continue
                    if 'A' <= cell <= 'F':
                        bit = ord(cell) - ord('A')
                        if (mask & (1 << bit)) == 0:
                            continue
                    next_mask = mask
                    if 'a' <= cell <= 'f':
                        next_mask |= 1 << (ord(cell) - ord('a'))
                    if not visited[nr][nc][next_mask]:
                        visited[nr][nc][next_mask] = True
                        queue.append((nr, nc, next_mask))
            steps += 1
        return -1
