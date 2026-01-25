class ContainsUppercase:
    def containsUppercase(self, s):
        return any('A' <= ch <= 'Z' for ch in s)
