class IsAllDigits:
    def isAllDigits(self, s):
        if not s:
            return False
        for ch in s:
            if ch < '0' or ch > '9':
                return False
        return True
