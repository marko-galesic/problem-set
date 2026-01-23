class ReverseDigits:
    def reverseDigits(self, n):
        sign = -1 if n < 0 else 1
        value = str(abs(n))
        reversed_value = int(value[::-1]) if value else 0
        return sign * reversed_value
