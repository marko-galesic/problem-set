class MinIncrementToMakeArrayUnique {
  minIncrementForUnique(nums) {
    if (!nums || nums.length === 0) {
      return 0;
    }
    nums.sort((a, b) => a - b);
    let moves = 0;
    let next = nums[0];
    for (const val of nums) {
      if (val < next) {
        moves += next - val;
      } else {
        next = val;
      }
      next += 1;
    }
    return moves;
  }
}
