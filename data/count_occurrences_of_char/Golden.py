class CountOccurrencesOfChar:
    def countOccurrencesOfChar(self, s, c):
        if not c:
            return 0
        target = c[0]
        return sum(1 for ch in s if ch == target)
