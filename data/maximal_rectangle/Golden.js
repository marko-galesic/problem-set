class MaximalRectangle {
  maximalRectangle(matrix) {
    if (!matrix || matrix.length === 0) {
      return 0;
    }
    const rows = matrix.length;
    const cols = matrix[0].length;
    const heights = new Array(cols).fill(0);
    let best = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (matrix[r][c] === '1') {
          heights[c] += 1;
        } else {
          heights[c] = 0;
        }
      }
      const stack = [];
      for (let i = 0; i <= cols; i++) {
        const h = i === cols ? 0 : heights[i];
        while (stack.length && h < heights[stack[stack.length - 1]]) {
          const height = heights[stack.pop()];
          const width = stack.length ? i - stack[stack.length - 1] - 1 : i;
          best = Math.max(best, height * width);
        }
        stack.push(i);
      }
    }
    return best;
  }
}
