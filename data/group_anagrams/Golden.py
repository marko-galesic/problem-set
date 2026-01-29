class GroupAnagrams:
    def groupAnagrams(self, strs):
        if strs is None or len(strs) == 0:
            return []

        groups = {}
        for s in strs:
            key = "".join(sorted(s))
            groups.setdefault(key, []).append(s)

        return list(groups.values())
