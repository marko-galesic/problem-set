class RedundantConnection:
    class DSU:
        def __init__(self, n):
            self.parent = list(range(n + 1))
            self.rank = [0] * (n + 1)

        def find(self, x):
            if self.parent[x] != x:
                self.parent[x] = self.find(self.parent[x])
            return self.parent[x]

        def union(self, a, b):
            ra = self.find(a)
            rb = self.find(b)
            if ra == rb:
                return False
            if self.rank[ra] < self.rank[rb]:
                self.parent[ra] = rb
            elif self.rank[ra] > self.rank[rb]:
                self.parent[rb] = ra
            else:
                self.parent[rb] = ra
                self.rank[ra] += 1
            return True

    def findRedundantConnection(self, edges):
        max_node = 0
        for u, v in edges:
            max_node = max(max_node, u, v)
        dsu = RedundantConnection.DSU(max_node)
        answer = []
        for u, v in edges:
            if not dsu.union(u, v):
                answer = [u, v]
        return answer
