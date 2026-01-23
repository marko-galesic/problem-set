class SudokuSolver:
    def solveSudoku(self, board):
        if not board:
            return board

        size = 9
        row_used = [[False] * size for _ in range(size)]
        col_used = [[False] * size for _ in range(size)]
        box_used = [[False] * size for _ in range(size)]
        empty_cells = []

        for r in range(size):
            for c in range(size):
                value = board[r][c]
                if value == '.':
                    empty_cells.append((r, c))
                else:
                    digit = ord(value) - ord('1')
                    if 0 <= digit < size:
                        row_used[r][digit] = True
                        col_used[c][digit] = True
                        box_used[(r // 3) * 3 + (c // 3)][digit] = True

        def backtrack(index):
            if index == len(empty_cells):
                return True

            r, c = empty_cells[index]
            box = (r // 3) * 3 + (c // 3)

            for digit in range(size):
                if row_used[r][digit] or col_used[c][digit] or box_used[box][digit]:
                    continue

                board[r][c] = chr(ord('1') + digit)
                row_used[r][digit] = True
                col_used[c][digit] = True
                box_used[box][digit] = True

                if backtrack(index + 1):
                    return True

                board[r][c] = '.'
                row_used[r][digit] = False
                col_used[c][digit] = False
                box_used[box][digit] = False

            return False

        backtrack(0)
        return board
