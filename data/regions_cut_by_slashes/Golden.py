class RegionsCutBySlashes:
    def regionsBySlashes(self, grid):
        n = len(grid)
        total = n * n * 4
        parent = list(range(total))

        def find(x):
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]

        def union(a, b):
            ra = find(a)
            rb = find(b)
            if ra != rb:
                parent[rb] = ra

        for r in range(n):
            for c in range(n):
                base = (r * n + c) * 4
                ch = grid[r][c]
                if ch == ' ':
                    union(base, base + 1)
                    union(base + 1, base + 2)
                    union(base + 2, base + 3)
                elif ch == '/':
                    union(base, base + 3)
                    union(base + 1, base + 2)
                elif ch == '\\':
                    union(base, base + 1)
                    union(base + 2, base + 3)

                if r > 0:
                    top_base = ((r - 1) * n + c) * 4
                    union(base, top_base + 2)
                if c > 0:
                    left_base = (r * n + c - 1) * 4
                    union(base + 3, left_base + 1)

        roots = {find(i) for i in range(total)}
        return len(roots)
