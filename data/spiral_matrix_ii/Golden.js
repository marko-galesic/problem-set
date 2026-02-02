class SpiralMatrixII {
  generateMatrix(n) {
    const result = Array.from({ length: n }, () => new Array(n).fill(0));
    let top = 0;
    let bottom = n - 1;
    let left = 0;
    let right = n - 1;
    let value = 1;
    while (top <= bottom && left <= right) {
      for (let j = left; j <= right; j++) {
        result[top][j] = value++;
      }
      top++;
      for (let i = top; i <= bottom; i++) {
        result[i][right] = value++;
      }
      right--;
      if (top <= bottom) {
        for (let j = right; j >= left; j--) {
          result[bottom][j] = value++;
        }
        bottom--;
      }
      if (left <= right) {
        for (let i = bottom; i >= top; i--) {
          result[i][left] = value++;
        }
        left++;
      }
    }
    return result;
  }
}
