class SingleNumber {
  singleNumber(nums) {
    if (!nums) {
      return 0;
    }
    let result = 0;
    for (const num of nums) {
      result ^= num;
    }
    return result;
  }
}
