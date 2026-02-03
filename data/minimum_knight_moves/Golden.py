from collections import deque


class MinimumKnightMoves:
    def minKnightMoves(self, n, start, end):
        if n <= 0:
            return -1
        sr, sc = start
        tr, tc = end
        if (sr, sc) == (tr, tc):
            return 0
        moves = [(2, 1), (2, -1), (-2, 1), (-2, -1), (1, 2), (1, -2), (-1, 2), (-1, -2)]
        visited = [[False] * n for _ in range(n)]
        queue = deque([(sr, sc)])
        visited[sr][sc] = True
        steps = 0
        while queue:
            for _ in range(len(queue)):
                r, c = queue.popleft()
                if (r, c) == (tr, tc):
                    return steps
                for dr, dc in moves:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < n and 0 <= nc < n and not visited[nr][nc]:
                        visited[nr][nc] = True
                        queue.append((nr, nc))
            steps += 1
        return -1
