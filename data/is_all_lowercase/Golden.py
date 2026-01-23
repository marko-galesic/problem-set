class IsAllLowercase:
    def isAllLowercase(self, s):
        has_letter = False
        for c in s:
            if c.isalpha():
                has_letter = True
                if not c.islower():
                    return False
        return has_letter
