class ReplaceVowelsWithStar:
    def replaceVowelsWithStar(self, s):
        return "".join("*" if c.lower() in "aeiou" else c for c in s)
