class ContainerWithMostWater {
  maxArea(height) {
    if (!height || height.length < 2) {
      return 0;
    }
    let left = 0;
    let right = height.length - 1;
    let best = 0;
    while (left < right) {
      const leftHeight = height[left];
      const rightHeight = height[right];
      const minHeight = leftHeight < rightHeight ? leftHeight : rightHeight;
      const area = minHeight * (right - left);
      if (area > best) {
        best = area;
      }
      if (leftHeight <= rightHeight) {
        left++;
      } else {
        right--;
      }
    }
    return best;
  }
}
