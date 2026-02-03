from collections import deque


class WallsAndGates:
    def wallsAndGates(self, rooms):
        if rooms is None:
            return None
        if not rooms:
            return []
        rows = len(rooms)
        cols = len(rooms[0])
        queue = deque()
        for r in range(rows):
            for c in range(cols):
                if rooms[r][c] == 0:
                    queue.append((r, c))
        dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        while queue:
            r, c = queue.popleft()
            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                if nr < 0 or nc < 0 or nr >= rows or nc >= cols:
                    continue
                if rooms[nr][nc] != 2147483647:
                    continue
                rooms[nr][nc] = rooms[r][c] + 1
                queue.append((nr, nc))
        return rooms
