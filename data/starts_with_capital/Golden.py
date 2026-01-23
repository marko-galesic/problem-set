class StartsWithCapital:
    def startsWithCapital(self, s):
        if not s:
            return False
        return 'A' <= s[0] <= 'Z'
