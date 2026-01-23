class RemoveDigits:
    def removeDigits(self, s):
        return "".join(c for c in s if not c.isdigit())
