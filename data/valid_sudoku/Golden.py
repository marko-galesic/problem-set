class ValidSudoku:
    def isValidSudoku(self, board):
        if not board or len(board) != 9:
            return False

        rows = [[False] * 9 for _ in range(9)]
        cols = [[False] * 9 for _ in range(9)]
        boxes = [[False] * 9 for _ in range(9)]

        for r in range(9):
            if not isinstance(board[r], list) or len(board[r]) != 9:
                return False
            for c in range(9):
                value = board[r][c]
                if value == '.':
                    continue
                if not isinstance(value, str) or len(value) != 1:
                    return False
                if value < '1' or value > '9':
                    return False
                num = ord(value) - ord('1')
                box = (r // 3) * 3 + (c // 3)
                if rows[r][num] or cols[c][num] or boxes[box][num]:
                    return False
                rows[r][num] = True
                cols[c][num] = True
                boxes[box][num] = True

        return True
