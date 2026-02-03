from collections import deque


class ZeroOneMatrix:
    def updateMatrix(self, mat):
        if mat is None:
            return None
        if not mat:
            return []
        rows = len(mat)
        cols = len(mat[0])
        dist = [[-1] * cols for _ in range(rows)]
        queue = deque()
        for r in range(rows):
            for c in range(cols):
                if mat[r][c] == 0:
                    dist[r][c] = 0
                    queue.append((r, c))
        dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        while queue:
            r, c = queue.popleft()
            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                if nr < 0 or nc < 0 or nr >= rows or nc >= cols:
                    continue
                if dist[nr][nc] != -1:
                    continue
                dist[nr][nc] = dist[r][c] + 1
                queue.append((nr, nc))
        return dist
