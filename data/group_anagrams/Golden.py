class GroupAnagrams:
    def groupAnagrams(self, strs):
        if strs is None or len(strs) == 0:
            return []

        groups = {}
        for s in strs:
            key = "".join(sorted(s))
            groups.setdefault(key, []).append(s)

        result = list(groups.values())
        for group in result:
            group.sort()
        result.sort()
        return result
