class ContainsLowercase:
    def containsLowercase(self, s):
        return any('a' <= ch <= 'z' for ch in s)
