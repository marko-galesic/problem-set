class FloodFill:
    def floodFill(self, image, sr, sc, color):
        if not image or not image[0]:
            return image
        original = image[sr][sc]
        if original == color:
            return image
        rows = len(image)
        cols = len(image[0])
        stack = [(sr, sc)]
        image[sr][sc] = color
        while stack:
            r, c = stack.pop()
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr = r + dr
                nc = c + dc
                if 0 <= nr < rows and 0 <= nc < cols and image[nr][nc] == original:
                    image[nr][nc] = color
                    stack.append((nr, nc))
        return image
