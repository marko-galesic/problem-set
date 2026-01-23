class CountLowercase:
    def countLowercase(self, s):
        return sum(1 for c in s if c.islower())
