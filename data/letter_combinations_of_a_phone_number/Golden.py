class LetterCombinationsOfAPhoneNumber:
    def letterCombinations(self, digits):
        if not digits:
            return []

        mapping = {
            '2': 'abc',
            '3': 'def',
            '4': 'ghi',
            '5': 'jkl',
            '6': 'mno',
            '7': 'pqrs',
            '8': 'tuv',
            '9': 'wxyz'
        }

        results = []
        current = []

        def backtrack(index):
            if index == len(digits):
                results.append(''.join(current))
                return
            letters = mapping.get(digits[index])
            if not letters:
                return
            for ch in letters:
                current.append(ch)
                backtrack(index + 1)
                current.pop()

        backtrack(0)
        return results
