class ContainsVowel:
    def containsVowel(self, s):
        return any(c.lower() in "aeiou" for c in s)
