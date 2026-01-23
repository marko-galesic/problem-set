class ContainsDigit:
    def containsDigit(self, s):
        return any(c.isdigit() for c in s)
