class ProductOfDigits:
    def productOfDigits(self, n):
        value = abs(n)
        if value == 0:
            return 0
        product = 1
        for c in str(value):
            product *= int(c)
        return product
