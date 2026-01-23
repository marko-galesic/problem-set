class StartsWithVowel:
    def startsWithVowel(self, s):
        if not s:
            return False
        return s[0].lower() in "aeiou"
