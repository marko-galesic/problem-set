class ClampToHundred:
    def clampToHundred(self, n):
        if n < -100:
            return -100
        if n > 100:
            return 100
        return n
