class StartsWithLowercase:
    def startsWithLowercase(self, s):
        if not s:
            return False
        return 'a' <= s[0] <= 'z'
