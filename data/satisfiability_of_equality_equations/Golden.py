class SatisfiabilityOfEqualityEquations:
    def equationsPossible(self, equations):
        parent = list(range(26))

        def find(x):
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]

        def union(a, b):
            ra = find(a)
            rb = find(b)
            if ra != rb:
                parent[rb] = ra

        for eq in equations:
            if eq[1] == '=':
                union(ord(eq[0]) - 97, ord(eq[3]) - 97)

        for eq in equations:
            if eq[1] == '!':
                if find(ord(eq[0]) - 97) == find(ord(eq[3]) - 97):
                    return False
        return True
