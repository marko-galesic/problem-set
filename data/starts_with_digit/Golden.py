class StartsWithDigit:
    def startsWithDigit(self, s):
        if not s:
            return False
        return '0' <= s[0] <= '9'
