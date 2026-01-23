class OnlyLetters:
    def onlyLetters(self, s):
        return "".join(c for c in s if c.isalpha())
