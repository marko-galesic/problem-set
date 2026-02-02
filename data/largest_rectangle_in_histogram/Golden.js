class LargestRectangleInHistogram {
  largestRectangleArea(heights) {
    const n = heights.length;
    let maxArea = 0;
    const stack = [];
    for (let i = 0; i <= n; i++) {
      const h = i === n ? 0 : heights[i];
      while (stack.length && h < heights[stack[stack.length - 1]]) {
        const height = heights[stack.pop()];
        const width = stack.length ? i - stack[stack.length - 1] - 1 : i;
        maxArea = Math.max(maxArea, height * width);
      }
      stack.push(i);
    }
    return maxArea;
  }
}
