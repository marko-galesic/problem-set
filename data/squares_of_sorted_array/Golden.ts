class SquaresOfSortedArray {
  sortedSquares(nums) {
    const result = new Array(nums.length);
    let left = 0;
    let right = nums.length - 1;
    let write = nums.length - 1;
    while (left <= right) {
      const leftVal = nums[left];
      const rightVal = nums[right];
      const leftSq = leftVal * leftVal;
      const rightSq = rightVal * rightVal;
      if (leftSq > rightSq) {
        result[write--] = leftSq;
        left += 1;
      } else {
        result[write--] = rightSq;
        right -= 1;
      }
    }
    return result;
  }
}
