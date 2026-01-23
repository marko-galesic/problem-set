class SwapFirstLastChar:
    def swapFirstLastChar(self, s):
        if len(s) <= 1:
            return s
        return s[-1] + s[1:-1] + s[0]
