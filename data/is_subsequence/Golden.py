class IsSubsequence:
    def isSubsequence(self, s, t):
        if s is None or t is None:
            return False
        if len(s) == 0:
            return True

        i = 0
        j = 0
        while i < len(s) and j < len(t):
            if s[i] == t[j]:
                i += 1
            j += 1
        return i == len(s)
