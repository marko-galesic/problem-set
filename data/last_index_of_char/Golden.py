class LastIndexOfChar:
    def lastIndexOfChar(self, s, c):
        if not c:
            return -1
        return s.rfind(c[0])
