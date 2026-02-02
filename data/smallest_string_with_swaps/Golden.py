class SmallestStringWithSwaps:
    class DSU:
        def __init__(self, n):
            self.parent = list(range(n))
            self.rank = [0] * n

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

    def smallestStringWithSwaps(self, s, pairs):
        n = len(s)
        dsu = SmallestStringWithSwaps.DSU(n)
        for a, b in pairs:
            dsu.union(a, b)
        groups = {}
        for i in range(n):
            root = dsu.find(i)
            groups.setdefault(root, []).append(i)
        res = list(s)
        for indices in groups.values():
            chars = [res[i] for i in indices]
            indices.sort()
            chars.sort()
            for idx, ch in zip(indices, chars):
                res[idx] = ch
        return "".join(res)
