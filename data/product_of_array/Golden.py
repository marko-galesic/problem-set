class ProductOfArray:
    def productOfArray(self, nums):
        product = 1
        for value in nums:
            product *= value
        return product
