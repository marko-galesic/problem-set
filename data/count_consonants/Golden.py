class CountConsonants:
    def countConsonants(self, s):
        count = 0
        for c in s:
            if c.isalpha() and c.lower() not in "aeiou":
                count += 1
        return count
