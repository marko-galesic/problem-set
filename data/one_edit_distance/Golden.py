class OneEditDistance:
    def oneEditDistance(self, s, t):
        if s == t:
            return False
        if len(s) > len(t):
            s, t = t, s
        if len(t) - len(s) > 1:
            return False
        i = 0
        j = 0
        diff = 0
        while i < len(s) and j < len(t):
            if s[i] == t[j]:
                i += 1
                j += 1
            else:
                diff += 1
                if diff > 1:
                    return False
                if len(s) == len(t):
                    i += 1
                    j += 1
                else:
                    j += 1
        return True