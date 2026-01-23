class MinimumWindowSubstring:
    def minWindow(self, s, t):
        if not s or not t:
            return ""
        if len(t) > len(s):
            return ""

        need = {}
        for ch in t:
            need[ch] = need.get(ch, 0) + 1

        window = {}
        required = len(need)
        formed = 0
        left = 0
        best_len = float('inf')
        best_left = 0

        for right, ch in enumerate(s):
            window[ch] = window.get(ch, 0) + 1
            if ch in need and window[ch] == need[ch]:
                formed += 1

            while left <= right and formed == required:
                window_len = right - left + 1
                if window_len < best_len:
                    best_len = window_len
                    best_left = left

                left_char = s[left]
                window[left_char] -= 1
                if left_char in need and window[left_char] < need[left_char]:
                    formed -= 1
                left += 1

        if best_len == float('inf'):
            return ""
        return s[best_left:best_left + best_len]
