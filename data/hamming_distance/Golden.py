class HammingDistance:
    def hammingDistance(self, x, y):
        return (x ^ y).bit_count()
