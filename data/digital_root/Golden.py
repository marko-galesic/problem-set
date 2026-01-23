class DigitalRoot:
    def digitalRoot(self, n):
        value = abs(n)
        while value >= 10:
            value = sum(int(c) for c in str(value))
        return value
