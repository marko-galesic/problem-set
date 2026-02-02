class SimplifyPath:
    def simplifyPath(self, path):
        parts = []
        for part in path.split('/'):
            if part == '' or part == '.':
                continue
            if part == '..':
                if parts:
                    parts.pop()
            else:
                parts.append(part)
        return '/' + '/'.join(parts)