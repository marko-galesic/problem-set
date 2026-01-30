class IsomorphicStrings:
    def isIsomorphic(self, s, t):
        if len(s) != len(t):
            return False
        map_st = {}
        map_ts = {}
        for i in range(len(s)):
            a = s[i]
            b = t[i]
            if a in map_st and map_st[a] != b:
                return False
            if b in map_ts and map_ts[b] != a:
                return False
            map_st[a] = b
            map_ts[b] = a
        return True
