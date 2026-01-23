class ValidAnagram:
    def isAnagram(self, s, t):
        if s is None or t is None:
            return s == t
        if len(s) != len(t):
            return False
        return sorted(s) == sorted(t)
