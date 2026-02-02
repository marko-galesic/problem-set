class AccountsMerge:
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

    def accountsMerge(self, accounts):
        email_id = {}
        email_name = {}
        parsed = []

        for account in accounts:
            tokens = account.split(",")
            if not tokens:
                continue
            name = tokens[0]
            emails = tokens[1:]
            parsed.append(emails)
            for email in emails:
                if email not in email_id:
                    email_id[email] = len(email_id)
                email_name[email] = name

        dsu = AccountsMerge.DSU(len(email_id))
        for emails in parsed:
            if not emails:
                continue
            first_id = email_id[emails[0]]
            for email in emails[1:]:
                dsu.union(first_id, email_id[email])

        groups = {}
        for email, idx in email_id.items():
            root = dsu.find(idx)
            groups.setdefault(root, []).append(email)

        merged = []
        for emails in groups.values():
            emails.sort()
            name = email_name[emails[0]]
            merged.append([name] + emails)

        merged.sort(key=lambda row: (row[0], row[1] if len(row) > 1 else ""))
        return merged
