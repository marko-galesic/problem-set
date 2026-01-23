class ClampToRange:
    def clampToRange(self, n, low, high):
        return max(low, min(high, n))
