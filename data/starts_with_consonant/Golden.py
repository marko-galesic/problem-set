class StartsWithConsonant:
    def startsWithConsonant(self, s):
        if not s:
            return False
        c = s[0]
        lower = c.lower()
        if not ('a' <= lower <= 'z'):
            return False
        return lower not in 'aeiou'
