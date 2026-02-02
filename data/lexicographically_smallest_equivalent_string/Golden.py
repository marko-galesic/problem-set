class LexicographicallySmallestEquivalentString:
    def smallestEquivalentString(self, s1, s2, baseStr):
        parent = list(range(26))

        def find(x):
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]

        def union(a, b):
            ra = find(a)
            rb = find(b)
            if ra == rb:
                return
            if ra < rb:
                parent[rb] = ra
            else:
                parent[ra] = rb

        for a, b in zip(s1, s2):
            union(ord(a) - 97, ord(b) - 97)

        result = []
        for ch in baseStr:
            root = find(ord(ch) - 97)
            result.append(chr(root + 97))
        return "".join(result)
