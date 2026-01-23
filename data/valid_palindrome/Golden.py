class ValidPalindrome:
    def isPalindrome(self, s):
        if s is None:
            return True
        left = 0
        right = len(s) - 1
        while left < right:
            left_char = s[left]
            right_char = s[right]
            if not left_char.isalnum():
                left += 1
                continue
            if not right_char.isalnum():
                right -= 1
                continue
            if left_char.lower() != right_char.lower():
                return False
            left += 1
            right -= 1
        return True
