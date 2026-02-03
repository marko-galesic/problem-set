class RemoveKDigits:
    def removeKdigits(self, num, k):
        stack = []
        remaining = k
        for ch in num:
            while remaining > 0 and stack and stack[-1] > ch:
                stack.pop()
                remaining -= 1
            stack.append(ch)
        while remaining > 0 and stack:
            stack.pop()
            remaining -= 1
        result = ''.join(stack).lstrip('0')
        return result if result else '0'
