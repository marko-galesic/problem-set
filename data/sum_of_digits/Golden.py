class SumOfDigits:
    def sumOfDigits(self, n):
        return sum(int(c) for c in str(abs(n)))
