class MoveZeroes {
  moveZeroes(nums) {
    if (!Array.isArray(nums)) {
      return null;
    }

    const result = new Array(nums.length).fill(0);
    let index = 0;
    for (const num of nums) {
      if (num !== 0) {
        result[index] = num;
        index += 1;
      }
    }
    return result;
  }
}
