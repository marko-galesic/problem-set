class SumOfDigitSquares:
    def sumOfDigitSquares(self, n):
        n = abs(n)
        total = 0
        while n > 0:
            digit = n % 10
            total += digit * digit
            n //= 10
        return total
