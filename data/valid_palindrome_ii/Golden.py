class ValidPalindromeII:
    def validPalindrome(self, s: str) -> bool:
        if s is None:
            return True
        left = 0
        right = len(s) - 1
        while left < right:
            if s[left] == s[right]:
                left += 1
                right -= 1
                continue
            return self._is_palindrome_range(s, left + 1, right) or self._is_palindrome_range(s, left, right - 1)
        return True

    def _is_palindrome_range(self, s: str, left: int, right: int) -> bool:
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True
