class RotateStringK:
    def rotateStringK(self, s, k):
        if s is None or len(s) == 0:
            return "" if s is None else s
        n = len(s)
        shift = k % n
        if shift == 0:
            return s
        return s[n - shift:] + s[:n - shift]
