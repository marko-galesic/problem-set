class SubarrayBitwiseOrs:
    def subarrayBitwiseORs(self, arr):
        result = set()
        prev = set()
        for n in arr:
            cur = {n}
            for v in prev:
                cur.add(v | n)
            result.update(cur)
            prev = cur
        return len(result)
