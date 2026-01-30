class MultiplyStrings:
    def multiplyStrings(self, num1, num2):
        if num1 == "0" or num2 == "0":
            return "0"
        m = len(num1)
        n = len(num2)
        pos = [0] * (m + n)
        for i in range(m - 1, -1, -1):
            d1 = ord(num1[i]) - 48
            for j in range(n - 1, -1, -1):
                d2 = ord(num2[j]) - 48
                total = d1 * d2 + pos[i + j + 1]
                pos[i + j + 1] = total % 10
                pos[i + j] += total // 10
        idx = 0
        while idx < len(pos) and pos[idx] == 0:
            idx += 1
        result = "".join(str(d) for d in pos[idx:])
        return result if result else "0"
