class FloodFill {
  floodFill(image, sr, sc, color) {
    if (!image || image.length === 0 || image[0].length === 0) return image;
    const original = image[sr][sc];
    if (original === color) return image;
    const rows = image.length;
    const cols = image[0].length;
    const stack = [[sr, sc]];
    image[sr][sc] = color;
    const dirs = [[1,0], [-1,0], [0,1], [0,-1]];
    while (stack.length) {
      const [r, c] = stack.pop();
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && image[nr][nc] === original) {
          image[nr][nc] = color;
          stack.push([nr, nc]);
        }
      }
    }
    return image;
  }
}
