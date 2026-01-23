class FirstIndexOfChar:
    def firstIndexOfChar(self, s, c):
        if not c:
            return -1
        return s.find(c[0])
