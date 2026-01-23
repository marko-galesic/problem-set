class IsAllUppercase:
    def isAllUppercase(self, s):
        has_letter = False
        for c in s:
            if c.isalpha():
                has_letter = True
                if not c.isupper():
                    return False
        return has_letter
