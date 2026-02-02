class DecodeString:
    def decodeString(self, s):
        counts = []
        builders = []
        current = []
        number = 0
        for ch in s:
            if ch.isdigit():
                number = number * 10 + int(ch)
            elif ch == '[':
                counts.append(number)
                builders.append(current)
                current = []
                number = 0
            elif ch == ']':
                repeat = counts.pop()
                prev = builders.pop()
                prev.extend(current * repeat)
                current = prev
            else:
                current.append(ch)
        return ''.join(current)
