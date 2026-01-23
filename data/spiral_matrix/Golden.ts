class SpiralMatrix {
  spiralOrder(matrix) {
    if (!Array.isArray(matrix) || matrix.length === 0 || !Array.isArray(matrix[0]) || matrix[0].length === 0) {
      return [];
    }

    const rows = matrix.length;
    const cols = matrix[0].length;
    const result = [];
    let top = 0;
    let bottom = rows - 1;
    let left = 0;
    let right = cols - 1;

    while (top <= bottom && left <= right) {
      for (let c = left; c <= right; c += 1) {
        result.push(matrix[top][c]);
      }
      top += 1;

      for (let r = top; r <= bottom; r += 1) {
        result.push(matrix[r][right]);
      }
      right -= 1;

      if (top <= bottom) {
        for (let c = right; c >= left; c -= 1) {
          result.push(matrix[bottom][c]);
        }
        bottom -= 1;
      }

      if (left <= right) {
        for (let r = bottom; r >= top; r -= 1) {
          result.push(matrix[r][left]);
        }
        left += 1;
      }
    }

    return result;
  }
}
