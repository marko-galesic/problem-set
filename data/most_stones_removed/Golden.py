class MostStonesRemoved:
    class DSU:
        def __init__(self):
            self.parent = []
            self.rank = []

        def add(self):
            idx = len(self.parent)
            self.parent.append(idx)
            self.rank.append(0)
            return idx

        def find(self, x):
            if self.parent[x] != x:
                self.parent[x] = self.find(self.parent[x])
            return self.parent[x]

        def union(self, a, b):
            ra = self.find(a)
            rb = self.find(b)
            if ra == rb:
                return
            if self.rank[ra] < self.rank[rb]:
                self.parent[ra] = rb
            elif self.rank[ra] > self.rank[rb]:
                self.parent[rb] = ra
            else:
                self.parent[rb] = ra
                self.rank[ra] += 1

    def removeStones(self, stones):
        dsu = MostStonesRemoved.DSU()
        ids = {}
        used = set()

        for r, c in stones:
            row_key = f"r{r}"
            col_key = f"c{c}"
            if row_key not in ids:
                ids[row_key] = dsu.add()
            if col_key not in ids:
                ids[col_key] = dsu.add()
            row_id = ids[row_key]
            col_id = ids[col_key]
            dsu.union(row_id, col_id)
            used.add(row_id)
            used.add(col_id)

        roots = {dsu.find(i) for i in used}
        return len(stones) - len(roots)
